import { model } from "@medusajs/framework/utils"

const NavItem = model.define("nav_item", {
  id: model.id().primaryKey(),
  label: model.text(),
  slug: model.text(),
  url: model.text().nullable(),
  sort_order: model.number().default(0),
  is_visible: model.boolean().default(true),
  position: model.enum(["HEADER", "FOOTER", "MOBILE_MENU"]),
  source_type: model
    .enum([
      "PRODUCT_CATEGORY",
      "DEVICE_BRAND",
      "DEVICE_SERIES",
      "CUSTOM_URL",
      "PRODUCT_COLLECTION",
    ])
    .nullable(),
  source_id: model.text().nullable(),
  parent_id: model.text().nullable(),
  badge_text: model.text().nullable(),
  highlight_color: model.text().nullable(),
  metadata: model.json().nullable(),
  translations: model.json().nullable(),
})

export default NavItem
