import { MedusaService } from "@medusajs/framework/utils"
import DeviceBrand from "./models/device-brand"
import DeviceSeries from "./models/device-series"
import DeviceModel from "./models/device-model"

class DeviceModuleService extends MedusaService({
  DeviceBrand,
  DeviceSeries,
  DeviceModel,
}) {}

export default DeviceModuleService
