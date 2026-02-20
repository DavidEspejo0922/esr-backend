// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { pageId } = req.params
  const contentService = req.scope.resolve("content")

  try {
    const page = await contentService.retrieveContentPage(pageId, {
      relations: ["blocks"],
    })

    // Sort blocks by sort_order
    if (page.blocks) {
      page.blocks.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }

    res.json({ page })
  } catch {
    res.status(404).json({ message: `Page "${pageId}" not found` })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { pageId } = req.params
  const contentService = req.scope.resolve("content")

  try {
    const page = await contentService.updateContentPages({ id: pageId, ...req.body })
    res.json({ page })
  } catch {
    res.status(404).json({ message: `Page "${pageId}" not found` })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { pageId } = req.params
  const contentService = req.scope.resolve("content")

  try {
    await contentService.deleteContentPages(pageId)
    res.status(200).json({ id: pageId, deleted: true })
  } catch {
    res.status(404).json({ message: `Page "${pageId}" not found` })
  }
}
