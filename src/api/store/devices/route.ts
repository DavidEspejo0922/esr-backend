// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { resolveEntityTranslations, resolveListTranslations } from "../../../utils/resolve-translations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const deviceModuleService = req.scope.resolve("device")
  const locale = (req.query.lang as string) || "es-CO"

  const deviceBrands = await deviceModuleService.listDeviceBrands(
    {},
    { relations: ["series"] }
  )

  const resolved = resolveListTranslations(deviceBrands, ["name"], locale).map(
    (brand) => ({
      ...brand,
      series: resolveListTranslations(brand.series || [], ["name"], locale),
    })
  )

  res.json({ device_brands: resolved })
}
