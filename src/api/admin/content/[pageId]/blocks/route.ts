// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { pageId } = req.params
  const contentService = req.scope.resolve("content")

  const block = await contentService.createContentBlocks({
    ...req.body,
    page_id: pageId,
  })

  res.status(201).json({ block })
}

// Bulk reorder blocks
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const contentService = req.scope.resolve("content")
  const { blocks } = req.body

  const updated = await Promise.all(
    blocks.map((b: { id: string; sort_order: number }) =>
      contentService.updateContentBlocks({ id: b.id, sort_order: b.sort_order })
    )
  )

  res.json({ blocks: updated })
}
