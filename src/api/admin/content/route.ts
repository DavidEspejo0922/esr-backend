// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const contentService = req.scope.resolve("content")

  const filters: Record<string, any> = {}
  if (req.query.locale) filters.locale = req.query.locale
  if (req.query.published !== undefined) filters.published = req.query.published === "true"

  const pages = await contentService.listContentPages(filters, {
    order: { created_at: "DESC" },
  })

  res.json({ pages })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const contentService = req.scope.resolve("content")
  const page = await contentService.createContentPages(req.body)
  res.status(201).json({ page })
}
