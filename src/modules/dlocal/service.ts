import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import { BigNumber } from "@medusajs/framework/utils"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  Logger,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import { createHmac } from "crypto"

export type DLocalOptions = {
  apiUrl: string
  xLogin: string
  xTransKey: string
  secretKey: string
  mock?: boolean
}

type DLocalPaymentStatus =
  | "PENDING"
  | "VERIFIED"
  | "PAID"
  | "REJECTED"
  | "CANCELLED"
  | "REFUNDED"

type DLocalPayment = {
  id: string
  amount: number
  currency: string
  status: DLocalPaymentStatus
  order_id?: string
  created_date: string
}

type InjectedDependencies = {
  logger: Logger
}

export class DLocalProviderService extends AbstractPaymentProvider<DLocalOptions> {
  static identifier = "dlocal"

  protected logger_: Logger
  protected options_: DLocalOptions

  constructor(container: InjectedDependencies, options: DLocalOptions) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options
  }

  private generateSignature(xLogin: string, xDate: string, body: string): string {
    const message = `${xLogin}${xDate}${body}`
    return createHmac("sha256", this.options_.secretKey)
      .update(message)
      .digest("hex")
  }

  private async dlocalRequest<T>(
    method: string,
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const xDate = new Date().toISOString()
    const bodyString = body ? JSON.stringify(body) : ""
    const signature = this.generateSignature(
      this.options_.xLogin,
      xDate,
      bodyString
    )

    const response = await fetch(`${this.options_.apiUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Date": xDate,
        "X-Login": this.options_.xLogin,
        "X-Trans-Key": this.options_.xTransKey,
        Authorization: `V2-HMAC-SHA256, Signature: ${signature}`,
      },
      body: bodyString || undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DLocal API error: ${response.status} ${errorText}`)
    }

    return response.json() as Promise<T>
  }

  private mapDLocalStatus(
    status: DLocalPaymentStatus
  ): "authorized" | "captured" | "canceled" | "pending" | "requires_more" | "error" {
    switch (status) {
      case "PAID":
        return "captured"
      case "VERIFIED":
        return "authorized"
      case "PENDING":
        return "pending"
      case "REJECTED":
      case "CANCELLED":
        return "canceled"
      case "REFUNDED":
        return "captured"
      default:
        return "pending"
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    if (this.options_.mock) {
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`
      return {
        id: mockId,
        data: {
          id: mockId,
          amount: input.amount,
          currency: input.currency_code.toUpperCase(),
          status: "PENDING",
          created_date: new Date().toISOString(),
        },
      }
    }

    const numericAmount = typeof input.amount === "number" ? input.amount : Number(input.amount)
    const payment = await this.dlocalRequest<DLocalPayment>("POST", "/payments", {
      amount: numericAmount / 100,
      currency: input.currency_code.toUpperCase(),
      country: (input.context as Record<string, unknown>)?.country || "CO",
      payment_method_id: "CARD",
      payment_method_flow: "DIRECT",
      payer: {
        name: (input.context as Record<string, unknown>)?.customer_email || "Guest",
        email: (input.context as Record<string, unknown>)?.customer_email || "",
      },
      order_id: `order_${Date.now()}`,
    })

    return {
      id: payment.id,
      data: payment as unknown as Record<string, unknown>,
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    if (this.options_.mock) {
      return {
        status: "authorized",
        data: {
          ...input.data,
          status: "VERIFIED",
        },
      }
    }

    const paymentId = input.data?.id as string
    const payment = await this.dlocalRequest<DLocalPayment>(
      "GET",
      `/payments/${paymentId}`
    )

    return {
      status: this.mapDLocalStatus(payment.status),
      data: payment as unknown as Record<string, unknown>,
    }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    if (this.options_.mock) {
      return {
        data: {
          ...input.data,
          status: "PAID",
          captured_date: new Date().toISOString(),
        },
      }
    }

    const paymentId = input.data?.id as string
    const payment = await this.dlocalRequest<DLocalPayment>(
      "POST",
      `/payments/${paymentId}/capture`,
      { amount: input.data?.amount }
    )

    return {
      data: payment as unknown as Record<string, unknown>,
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    if (this.options_.mock) {
      const mockRefundId = `refund_mock_${Date.now()}`
      return {
        data: {
          ...input.data,
          refund_id: mockRefundId,
          refund_amount: input.amount,
          refund_status: "SUCCESS",
        },
      }
    }

    const paymentId = input.data?.id as string
    const refundAmount = typeof input.amount === "number" ? input.amount : Number(input.amount)
    const refund = await this.dlocalRequest("POST", "/refunds", {
      payment_id: paymentId,
      amount: refundAmount / 100,
      currency: input.data?.currency,
    })

    return {
      data: {
        ...input.data,
        refund: refund,
      },
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    if (this.options_.mock) {
      return {
        data: {
          ...input.data,
          status: "CANCELLED",
          cancelled_date: new Date().toISOString(),
        },
      }
    }

    const paymentId = input.data?.id as string
    const payment = await this.dlocalRequest<DLocalPayment>(
      "POST",
      `/payments/${paymentId}/cancel`,
      {}
    )

    return {
      data: payment as unknown as Record<string, unknown>,
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: input.data,
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    if (this.options_.mock) {
      const status = (input.data?.status as DLocalPaymentStatus) || "PENDING"
      return { status: this.mapDLocalStatus(status) }
    }

    try {
      const paymentId = input.data?.id as string
      const payment = await this.dlocalRequest<DLocalPayment>(
        "GET",
        `/payments/${paymentId}`
      )
      return { status: this.mapDLocalStatus(payment.status) }
    } catch (error: unknown) {
      this.logger_.error(
        `Failed to get DLocal payment status: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      return { status: "error" }
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    if (this.options_.mock) {
      return { data: input.data }
    }

    const paymentId = input.data?.id as string
    const payment = await this.dlocalRequest<DLocalPayment>(
      "GET",
      `/payments/${paymentId}`
    )

    return { data: payment as unknown as Record<string, unknown> }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    if (this.options_.mock) {
      return {
        data: {
          ...input.data,
          amount: input.amount,
          currency: input.currency_code?.toUpperCase(),
          updated_date: new Date().toISOString(),
        },
      }
    }

    // DLocal typically requires cancel + recreate for updates
    // For now, just update the data
    return {
      data: {
        ...input.data,
        amount: input.amount,
        currency: input.currency_code?.toUpperCase(),
      },
    }
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    try {
      const { data: webhookData, rawData, headers } = data

      if (!this.options_.mock) {
        // Verify HMAC signature
        const xDate = headers?.["x-date"] || headers?.["X-Date"]
        const receivedSignature =
          headers?.["x-signature"] || headers?.["X-Signature"]

        if (!xDate || !receivedSignature) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Missing required webhook headers"
          )
        }

        const bodyString =
          typeof rawData === "string" ? rawData : JSON.stringify(webhookData)
        const expectedSignature = this.generateSignature(
          this.options_.xLogin,
          xDate as string,
          bodyString
        )

        if (receivedSignature !== expectedSignature) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Invalid webhook signature"
          )
        }
      }

      const status = (webhookData as Record<string, unknown>)?.status as DLocalPaymentStatus
      const sessionId = ((webhookData as Record<string, unknown>)?.metadata as Record<string, unknown>)?.session_id as string || ""
      const amount = ((webhookData as Record<string, unknown>)?.amount as number) || 0

      switch (status) {
        case "PAID":
          return {
            action: "captured",
            data: {
              session_id: sessionId,
              amount: new BigNumber(amount),
            },
          }
        case "VERIFIED":
          return {
            action: "authorized",
            data: {
              session_id: sessionId,
              amount: new BigNumber(amount),
            },
          }
        case "REJECTED":
        case "CANCELLED":
          return {
            action: "failed",
            data: {
              session_id: sessionId,
              amount: new BigNumber(amount),
            },
          }
        default:
          return {
            action: "not_supported",
            data: {
              session_id: "",
              amount: new BigNumber(0),
            },
          }
      }
    } catch (error: unknown) {
      this.logger_.error(
        `Failed to process DLocal webhook: ${error instanceof Error ? error.message : "Unknown error"}`
      )
      return {
        action: "not_supported",
        data: {
          session_id: "",
          amount: new BigNumber(0),
        },
      }
    }
  }
}
