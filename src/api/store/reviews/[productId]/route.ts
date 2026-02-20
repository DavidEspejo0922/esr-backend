// @ts-nocheck
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  // Use Query to get reviews linked to this product
  const { data: linkData } = await query.graph({
    entity: "product_product_review",
    filters: { product_id: productId },
    fields: ["product_review_id"],
  })

  const reviewIds = linkData.map((l: any) => l.product_review_id).filter(Boolean)

  if (reviewIds.length === 0) {
    res.json({
      reviews: [],
      summary: { average_rating: 0, total_reviews: 0 },
    })
    return
  }

  // Fetch reviews from the review module
  const reviewModuleService = req.scope.resolve("review")
  const reviews = await reviewModuleService.listProductReviews({
    id: reviewIds,
  })

  // Only return approved reviews on storefront
  const approvedReviews = reviews.filter(
    (r: { approved: boolean }) => r.approved
  )

  // Calculate summary
  const total = approvedReviews.length
  const avgRating =
    total > 0
      ? approvedReviews.reduce(
          (sum: number, r: { rating: number }) => sum + r.rating,
          0
        ) / total
      : 0

  res.json({
    reviews: approvedReviews,
    summary: {
      average_rating: Math.round(avgRating * 10) / 10,
      total_reviews: total,
    },
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { productId } = req.params
  const { author_name, rating, title, body } = req.body as {
    author_name: string
    rating: number
    title?: string
    body: string
  }

  const reviewModuleService = req.scope.resolve("review")
  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  // Create the review (unapproved by default)
  const review = await reviewModuleService.createProductReviews({
    author_name,
    rating,
    title: title ?? null,
    body,
    verified_purchase: false,
    approved: false,
  })

  // Link review to product
  await remoteLink.create({
    product: { product_id: productId },
    review: { product_review_id: review.id },
  })

  res.status(201).json({ review })
}
