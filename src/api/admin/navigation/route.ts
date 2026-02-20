// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const navigationService = req.scope.resolve("navigation")

  const navItems = await navigationService.listNavItems(
    {},
    { order: { sort_order: "ASC" } }
  )

  res.json({ nav_items: navItems })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const navigationService = req.scope.resolve("navigation")
  const navItem = await navigationService.createNavItems(req.body)
  res.status(201).json({ nav_item: navItem })
}
