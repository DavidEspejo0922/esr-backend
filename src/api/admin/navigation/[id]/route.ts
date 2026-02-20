// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const navigationService = req.scope.resolve("navigation")

  try {
    const navItem = await navigationService.retrieveNavItem(id)
    res.json({ nav_item: navItem })
  } catch {
    res.status(404).json({ message: `Nav item "${id}" not found` })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const navigationService = req.scope.resolve("navigation")

  try {
    const navItem = await navigationService.updateNavItems({ id, ...req.body })
    res.json({ nav_item: navItem })
  } catch {
    res.status(404).json({ message: `Nav item "${id}" not found` })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const navigationService = req.scope.resolve("navigation")

  try {
    await navigationService.deleteNavItems(id)
    res.status(200).json({ id, deleted: true })
  } catch {
    res.status(404).json({ message: `Nav item "${id}" not found` })
  }
}
