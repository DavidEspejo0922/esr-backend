import { defineMiddlewares } from "@medusajs/medusa"
import { z } from "zod"

export default defineMiddlewares({
  routes: [
    // Review creation validation
    {
      matcher: "/store/reviews/:productId",
      method: "POST",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            author_name: z.string().min(1).max(100),
            rating: z.number().int().min(1).max(5),
            title: z.string().max(200).optional(),
            body: z.string().min(10).max(2000),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Wishlist POST validation
    {
      matcher: "/store/wishlist",
      method: "POST",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            product_id: z.string().min(1),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Wishlist DELETE validation
    {
      matcher: "/store/wishlist",
      method: "DELETE",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            item_id: z.string().min(1),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Navigation admin POST validation
    {
      matcher: "/admin/navigation",
      method: "POST",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            label: z.string().min(1).max(200),
            slug: z.string().min(1).max(200),
            position: z.enum(["HEADER", "FOOTER", "MOBILE_MENU"]),
            url: z.string().nullable().optional(),
            sort_order: z.number().int().optional(),
            is_visible: z.boolean().optional(),
            source_type: z
              .enum([
                "PRODUCT_CATEGORY",
                "DEVICE_BRAND",
                "DEVICE_SERIES",
                "CUSTOM_URL",
                "PRODUCT_COLLECTION",
              ])
              .nullable()
              .optional(),
            source_id: z.string().nullable().optional(),
            parent_id: z.string().nullable().optional(),
            badge_text: z.string().nullable().optional(),
            highlight_color: z.string().nullable().optional(),
            translations: z
              .record(
                z.string(),
                z.object({
                  label: z.string().max(200).optional(),
                  badge_text: z.string().max(200).optional(),
                })
              )
              .nullable()
              .optional(),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Content page creation validation
    {
      matcher: "/admin/content",
      method: "POST",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            title: z.string().min(1).max(200),
            slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
            locale: z.enum(["es-CO", "es-VE", "es-EC"]),
            published: z.boolean().optional(),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Content block creation validation
    {
      matcher: "/admin/content/:pageId/blocks",
      method: "POST",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            type: z.enum(["HERO", "FEATURED_PRODUCTS", "RICH_TEXT", "CTA", "BANNER"]),
            sort_order: z.number().int().optional(),
            data: z.record(z.any()),
            medusa_handle: z.string().nullable().optional(),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
    // Content block bulk reorder validation
    {
      matcher: "/admin/content/:pageId/blocks",
      method: "PUT",
      middlewares: [
        async (req, _res, next) => {
          const schema = z.object({
            blocks: z.array(
              z.object({
                id: z.string().min(1),
                sort_order: z.number().int(),
              })
            ),
          })

          const result = schema.safeParse(req.body)
          if (!result.success) {
            throw new Error(
              `Validation failed: ${result.error.errors.map((e) => e.message).join(", ")}`
            )
          }

          next()
        },
      ],
    },
  ],
})
