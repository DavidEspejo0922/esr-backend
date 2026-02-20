import { model } from "@medusajs/framework/utils"
import DeviceBrand from "./device-brand"
import DeviceModel from "./device-model"

const DeviceSeries = model.define("device_series", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  slug: model.text().unique(),
  translations: model.json().nullable(),
  device_brand: model.belongsTo(() => DeviceBrand, { mappedBy: "series" }),
  models: model.hasMany(() => DeviceModel, { mappedBy: "device_series" }),
})

export default DeviceSeries
