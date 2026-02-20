// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveEntityTranslations, resolveListTranslations } from "../../../../utils/resolve-translations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { brandSlug } = req.params
  const deviceModuleService = req.scope.resolve("device")
  const locale = (req.query.lang as string) || "es-CO"

  const [deviceBrand] = await deviceModuleService.listDeviceBrands(
    { slug: brandSlug },
    { relations: ["series", "series.models"] }
  )

  if (!deviceBrand) {
    res.status(404).json({ message: `Device brand "${brandSlug}" not found` })
    return
  }

  const resolved = resolveEntityTranslations(deviceBrand, ["name"], locale)
  resolved.series = resolveListTranslations(resolved.series || [], ["name"], locale).map(
    (s) => ({
      ...s,
      models: resolveListTranslations(s.models || [], ["name"], locale),
    })
  )

  res.json({ device_brand: resolved })
}
