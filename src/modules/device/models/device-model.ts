import { model } from "@medusajs/framework/utils"
import DeviceSeries from "./device-series"

const DeviceModel = model.define("device_model", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  slug: model.text().unique(),
  image_url: model.text().nullable(),
  translations: model.json().nullable(),
  device_series: model.belongsTo(() => DeviceSeries, { mappedBy: "models" }),
})

export default DeviceModel
