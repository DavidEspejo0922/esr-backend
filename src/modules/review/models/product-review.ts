import { model } from "@medusajs/framework/utils"

const ProductReview = model.define("product_review", {
  id: model.id().primaryKey(),
  author_name: model.text(),
  rating: model.number(),
  title: model.text().nullable(),
  body: model.text(),
  verified_purchase: model.boolean().default(false),
  approved: model.boolean().default(false),
})

export default ProductReview
