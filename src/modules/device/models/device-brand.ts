import { model } from "@medusajs/framework/utils"
import DeviceSeries from "./device-series"

const DeviceBrand = model.define("device_brand", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  slug: model.text().unique(),
  logo_url: model.text().nullable(),
  translations: model.json().nullable(),
  series: model.hasMany(() => DeviceSeries, { mappedBy: "device_brand" }),
})

export default DeviceBrand
