// @ts-nocheck
import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "Authentication required" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Get wishlist linked to customer
  const { data } = await query.graph({
    entity: "customer",
    filters: { id: customerId },
    fields: ["id", "wishlist.*", "wishlist.items.*", "wishlist.items.product.*"],
  })

  const wishlist = data[0]?.wishlist ?? null

  res.json({ wishlist })
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "Authentication required" })
    return
  }

  const { product_id } = req.body as { product_id: string }
  const wishlistModuleService = req.scope.resolve("wishlist")
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Check if customer already has a wishlist
  const { data } = await query.graph({
    entity: "customer",
    filters: { id: customerId },
    fields: ["id", "wishlist.*", "wishlist.items.*"],
  })

  let wishlist = data[0]?.wishlist

  // Create wishlist if it doesn't exist
  if (!wishlist) {
    wishlist = await wishlistModuleService.createWishlists({})

    // Link wishlist to customer
    await remoteLink.create({
      customer: { customer_id: customerId },
      wishlist: { wishlist_id: wishlist.id },
    })
  }

  // Create wishlist item
  const item = await wishlistModuleService.createWishlistItems({
    wishlist_id: wishlist.id,
  })

  // Link wishlist item to product
  await remoteLink.create({
    product: { product_id },
    wishlist: { wishlist_item_id: item.id },
  })

  res.status(201).json({ wishlist_item: item })
}

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    res.status(401).json({ message: "Authentication required" })
    return
  }

  const { item_id } = req.body as { item_id: string }
  const wishlistModuleService = req.scope.resolve("wishlist")
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  // Delete the remote link first
  await remoteLink.dismiss({
    product: {},
    wishlist: { wishlist_item_id: item_id },
  })

  // Delete the wishlist item
  await wishlistModuleService.deleteWishlistItems(item_id)

  res.status(200).json({ success: true })
}
