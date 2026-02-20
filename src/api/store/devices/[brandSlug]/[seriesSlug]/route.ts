// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveEntityTranslations, resolveListTranslations } from "../../../../../utils/resolve-translations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { brandSlug, seriesSlug } = req.params
  const deviceModuleService = req.scope.resolve("device")
  const locale = (req.query.lang as string) || "es-CO"

  // Verify brand exists
  const [deviceBrand] = await deviceModuleService.listDeviceBrands({
    slug: brandSlug,
  })

  if (!deviceBrand) {
    res.status(404).json({ message: `Device brand "${brandSlug}" not found` })
    return
  }

  const [deviceSeries] = await deviceModuleService.listDeviceSeries(
    { slug: seriesSlug, device_brand_id: deviceBrand.id },
    { relations: ["models"] }
  )

  if (!deviceSeries) {
    res.status(404).json({ message: `Device series "${seriesSlug}" not found` })
    return
  }

  const resolved = resolveEntityTranslations(deviceSeries, ["name"], locale)
  resolved.models = resolveListTranslations(resolved.models || [], ["name"], locale)

  res.json({ device_series: resolved })
}
