import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import DeviceModule from "../modules/device"

export default defineLink(ProductModule.linkable.product, {
  linkable: DeviceModule.linkable.deviceModel,
  isList: true,
})
