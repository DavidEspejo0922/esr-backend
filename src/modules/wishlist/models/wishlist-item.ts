import { model } from "@medusajs/framework/utils"
import Wishlist from "./wishlist"

const WishlistItem = model.define("wishlist_item", {
  id: model.id().primaryKey(),
  wishlist: model.belongsTo(() => Wishlist, { mappedBy: "items" }),
})

export default WishlistItem
