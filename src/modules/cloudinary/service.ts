import { AbstractFileProviderService, MedusaError } from "@medusajs/framework/utils"
import type { FileTypes, Logger } from "@medusajs/framework/types"
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"
import { Readable, type Writable, PassThrough } from "stream"

export type CloudinaryOptions = {
  cloud_name: string
  api_key: string
  api_secret: string
  folder?: string
  secure?: boolean
}

type InjectedDependencies = {
  logger: Logger
}

export class CloudinaryFileProviderService extends AbstractFileProviderService {
  static identifier = "cloudinary"

  protected logger_: Logger
  protected options_: CloudinaryOptions

  constructor(container: InjectedDependencies, options: CloudinaryOptions) {
    super()
    this.logger_ = container.logger
    this.options_ = options

    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
      secure: options.secure ?? true,
    })
  }

  static validateOptions(options: Record<any, any>): void | never {
    if (!options.cloud_name) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cloudinary cloud_name is required"
      )
    }
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cloudinary api_key is required"
      )
    }
    if (!options.api_secret) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cloudinary api_secret is required"
      )
    }
  }

  private getFolder(mimeType: string): string {
    const base = this.options_.folder || "esr"
    if (mimeType?.startsWith("video/")) return `${base}/videos`
    return `${base}/images`
  }

  private getResourceType(
    mimeType: string
  ): "image" | "video" | "raw" | "auto" {
    if (mimeType?.startsWith("video/")) return "video"
    if (mimeType?.startsWith("image/")) return "image"
    return "auto"
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    const folder = this.getFolder(file.mimeType)
    const resourceType = this.getResourceType(file.mimeType)

    const dataUri = `data:${file.mimeType};base64,${file.content}`

    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        dataUri,
        {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
        }
      )

      this.logger_.info(
        `Cloudinary upload: ${result.public_id} (${result.bytes} bytes)`
      )

      return { url: result.secure_url, key: result.public_id }
    } catch (error) {
      this.logger_.error(
        `Cloudinary upload failed: ${error instanceof Error ? error.message : "Unknown"}`
      )
      throw error
    }
  }

  async delete(
    files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]
  ): Promise<void> {
    const arr = Array.isArray(files) ? files : [files]

    await Promise.all(
      arr.map(async (file) => {
        try {
          const resourceType = file.fileKey.includes("/videos/")
            ? ("video" as const)
            : ("image" as const)

          await cloudinary.uploader.destroy(file.fileKey, {
            resource_type: resourceType,
          })
          this.logger_.info(`Cloudinary delete: ${file.fileKey}`)
        } catch (error) {
          this.logger_.error(
            `Cloudinary delete failed for ${file.fileKey}: ${
              error instanceof Error ? error.message : "Unknown"
            }`
          )
        }
      })
    )
  }

  async getPresignedDownloadUrl(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    const resourceType = fileData.fileKey.includes("/videos/")
      ? "video"
      : "image"

    return cloudinary.url(fileData.fileKey, {
      resource_type: resourceType,
      secure: true,
    })
  }

  async getDownloadStream(
    fileData: FileTypes.ProviderGetFileDTO
  ): Promise<Readable> {
    const url = cloudinary.url(fileData.fileKey, {
      resource_type: "auto",
      secure: true,
    })

    const response = await fetch(url)
    if (!response.ok || !response.body) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `File ${fileData.fileKey} not found on Cloudinary`
      )
    }

    return Readable.fromWeb(response.body as any)
  }

  async getAsBuffer(fileData: FileTypes.ProviderGetFileDTO): Promise<Buffer> {
    const url = cloudinary.url(fileData.fileKey, {
      resource_type: "auto",
      secure: true,
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `File ${fileData.fileKey} not found on Cloudinary`
      )
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  async getUploadStream(
    fileData: FileTypes.ProviderUploadStreamDTO
  ): Promise<{
    writeStream: Writable
    promise: Promise<FileTypes.ProviderFileResultDTO>
    url: string
    fileKey: string
  }> {
    const folder = this.getFolder(fileData.mimeType)
    const resourceType = this.getResourceType(fileData.mimeType)

    const passThrough = new PassThrough()
    const tempFileKey = `${folder}/${Date.now()}-${fileData.filename}`

    const promise = new Promise<FileTypes.ProviderFileResultDTO>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) return reject(error)
            if (!result) return reject(new Error("Cloudinary returned no result"))
            resolve({ url: result.secure_url, key: result.public_id })
          }
        )
        passThrough.pipe(uploadStream)
      }
    )

    return { writeStream: passThrough, promise, url: "", fileKey: tempFileKey }
  }
}
