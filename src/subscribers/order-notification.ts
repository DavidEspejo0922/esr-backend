// @ts-nocheck
import type {
  SubscriberConfig,
  SubscriberArgs,
} from "@medusajs/framework";

type OrderPlacedEvent = {
  id: string;
};

export default async function orderNotificationHandler({
  event: { data },
  container,
}: SubscriberArgs<OrderPlacedEvent>) {
  const logger = container.resolve("logger");
  const orderModuleService = container.resolve("orderModuleService");

  try {
    // Retrieve order details
    const order = await orderModuleService.retrieveOrder(data.id, {
      relations: ["customer", "items", "shipping_address"],
    });

    if (!order) {
      logger.warn(
        `[OrderNotification] Order ${data.id} not found, skipping notification`
      );
      return;
    }

    // Phase 1: Log order details
    // Phase 2: Will integrate with Resend for email notifications
    logger.info(`[OrderNotification] Order placed:`, {
      orderId: order.id,
      customerEmail: order.email,
      totalAmount: order.total,
      currency: order.currency_code,
      itemCount: order.items?.length || 0,
      displayTotal: `${(order.total / 100).toFixed(2)} ${order.currency_code?.toUpperCase()}`,
    });

    logger.info(
      `[OrderNotification] Order ${order.id} - Customer: ${order.email} - Total: ${order.currency_code?.toUpperCase()} ${(order.total / 100).toFixed(2)}`
    );

    // TODO: Phase 2 - Integrate Resend email
    // - Send order confirmation email to customer
    // - Send notification to admin
    // - Template with order details, items, shipping info
  } catch (error) {
    logger.error(
      `[OrderNotification] Failed to process order notification for ${data.id}:`,
      error
    );
    // Don't throw - notification failure shouldn't affect order placement
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
};
