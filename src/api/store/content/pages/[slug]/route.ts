// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params
  const locale = (req.query.lang as string) || "es-CO"
  const contentModuleService = req.scope.resolve("content")

  const [page] = await contentModuleService.listContentPages(
    { slug, locale, published: true },
    {
      relations: ["blocks"],
      order: { blocks: { sort_order: "ASC" } },
    }
  )

  if (!page) {
    res.status(404).json({ message: `Page "${slug}" not found for locale "${locale}"` })
    return
  }

  res.json({ page })
}
