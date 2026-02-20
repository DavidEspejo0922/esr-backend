import { model } from "@medusajs/framework/utils"
import ContentBlock from "./content-block"

const ContentPage = model
  .define("content_page", {
    id: model.id().primaryKey(),
    title: model.text(),
    slug: model.text(),
    locale: model.text(),
    published: model.boolean().default(false),
    blocks: model.hasMany(() => ContentBlock, { mappedBy: "page" }),
  })
  .indexes([
    {
      on: ["slug", "locale"],
      unique: true,
    },
  ])

export default ContentPage
