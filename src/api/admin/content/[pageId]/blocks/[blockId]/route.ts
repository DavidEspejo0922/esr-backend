// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { blockId } = req.params
  const contentService = req.scope.resolve("content")

  try {
    const block = await contentService.updateContentBlocks({ id: blockId, ...req.body })
    res.json({ block })
  } catch {
    res.status(404).json({ message: `Block "${blockId}" not found` })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { blockId } = req.params
  const contentService = req.scope.resolve("content")

  try {
    await contentService.deleteContentBlocks(blockId)
    res.status(200).json({ id: blockId, deleted: true })
  } catch {
    res.status(404).json({ message: `Block "${blockId}" not found` })
  }
}
