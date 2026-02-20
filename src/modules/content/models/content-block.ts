import { model } from "@medusajs/framework/utils"
import ContentPage from "./content-page"

const ContentBlock = model.define("content_block", {
  id: model.id().primaryKey(),
  type: model.enum(["HERO", "FEATURED_PRODUCTS", "RICH_TEXT", "CTA", "BANNER"]),
  sort_order: model.number().default(0),
  data: model.json(),
  medusa_handle: model.text().nullable(),
  page: model.belongsTo(() => ContentPage, { mappedBy: "blocks" }),
})

export default ContentBlock
