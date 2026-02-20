import { model } from "@medusajs/framework/utils"
import WishlistItem from "./wishlist-item"

const Wishlist = model.define("wishlist", {
  id: model.id().primaryKey(),
  items: model.hasMany(() => WishlistItem, { mappedBy: "wishlist" }),
})

export default Wishlist
