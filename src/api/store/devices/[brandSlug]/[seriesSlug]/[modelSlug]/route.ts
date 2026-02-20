// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { resolveEntityTranslations } from "../../../../../../utils/resolve-translations"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { brandSlug, seriesSlug, modelSlug } = req.params
    const deviceModuleService = req.scope.resolve("device")
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const locale = (req.query.lang as string) || "es-CO"

    const [deviceBrand] = await deviceModuleService.listDeviceBrands({
      slug: brandSlug,
    })

    if (!deviceBrand) {
      res.status(404).json({ message: `Device brand "${brandSlug}" not found` })
      return
    }

    const [deviceSeries] = await deviceModuleService.listDeviceSeries({
      slug: seriesSlug,
      device_brand_id: deviceBrand.id,
    })

    if (!deviceSeries) {
      res.status(404).json({ message: `Device series "${seriesSlug}" not found` })
      return
    }

    const [deviceModel] = await deviceModuleService.listDeviceModels({
      slug: modelSlug,
      device_series_id: deviceSeries.id,
    })

    if (!deviceModel) {
      res.status(404).json({ message: `Device model "${modelSlug}" not found` })
      return
    }

    // Query the device_model entity and traverse to linked products
    const { data: deviceModelWithProducts } = await query.graph({
      entity: "device_model",
      filters: { id: deviceModel.id },
      fields: [
        "id",
        "product.*",
        "product.variants.*",
        "product.variants.prices.*",
        "product.options.*",
        "product.options.values.*",
      ],
    })

    const linked = deviceModelWithProducts[0]?.product ?? []
    const products = Array.isArray(linked) ? linked : [linked]

    const resolvedModel = resolveEntityTranslations(deviceModel, ["name"], locale)
    const resolvedSeries = resolveEntityTranslations(deviceSeries, ["name"], locale)
    const resolvedBrand = resolveEntityTranslations(deviceBrand, ["name"], locale)

    res.json({
      device_model: resolvedModel,
      device_series: { id: resolvedSeries.id, name: resolvedSeries.name, slug: resolvedSeries.slug },
      device_brand: { id: resolvedBrand.id, name: resolvedBrand.name, slug: resolvedBrand.slug },
      products,
    })
  } catch (error) {
    const logger = req.scope.resolve("logger")
    logger.error("[DeviceModelRoute]", error)
    res.status(500).json({ message: "Failed to load device model products" })
  }
}
