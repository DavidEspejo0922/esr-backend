import { model } from "@medusajs/framework/utils"

const Brand = model.define("brand", {
  id: model.id().primaryKey(),
  name: model.text().searchable(),
  slug: model.text().unique(),
  logo_url: model.text().nullable(),
  metadata: model.json().nullable(),
  translations: model.json().nullable(),
})

export default Brand
