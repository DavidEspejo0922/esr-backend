// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveEntityTranslations } from "../../../utils/resolve-translations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const navigationService = req.scope.resolve("navigation")
  const position = req.query.position as string | undefined
  const locale = (req.query.lang as string) || "es-CO"

  const filters: Record<string, any> = { is_visible: true }
  if (position) {
    filters.position = position
  }

  const navItems = await navigationService.listNavItems(filters, {
    order: { sort_order: "ASC" },
  })

  // Build parent-child tree with locale resolution
  const itemMap = new Map<string, any>()
  const roots: any[] = []

  for (const rawItem of navItems) {
    // Serialize to plain object so JSON columns are properly parsed
    const item = JSON.parse(JSON.stringify(rawItem))
    const resolved = resolveEntityTranslations(item, ["label", "badge_text"], locale)
    itemMap.set(resolved.id, { ...resolved, children: [] })
  }

  for (const item of navItems) {
    const node = itemMap.get(item.id)
    if (item.parent_id && itemMap.has(item.parent_id)) {
      itemMap.get(item.parent_id).children.push(node)
    } else {
      roots.push(node)
    }
  }

  res.json({ nav_items: roots })
}
