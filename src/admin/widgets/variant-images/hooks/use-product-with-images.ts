import { useState, useEffect, useCallback, useMemo } from "react"
import type { ProductForWidget, VariantImageMap } from "../types"

interface UseProductWithImagesReturn {
  product: ProductForWidget | null
  variantImageMap: VariantImageMap
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

function buildVariantImageMap(product: ProductForWidget): VariantImageMap {
  const map: VariantImageMap = new Map()

  for (const variant of product.variants ?? []) {
    map.set(variant.id, new Set())
  }

  for (const image of product.images ?? []) {
    for (const variant of image.variants ?? []) {
      if (!map.has(variant.id)) {
        map.set(variant.id, new Set())
      }
      map.get(variant.id)!.add(image.id)
    }
  }

  return map
}

export function useProductWithImages(
  productId: string | undefined
): UseProductWithImagesReturn {
  const [product, setProduct] = useState<ProductForWidget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!productId) return

    setLoading(true)
    setError(null)

    try {
      const fields = [
        "+images",
        "+images.variants",
        "+variants.images",
        "+variants.options",
        "+variants.options.option",
      ].join(",")

      const res = await fetch(
        `/admin/products/${productId}?fields=${fields}`,
        { credentials: "include" }
      )

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      setProduct(data.product)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar producto"
      setError(message)
      console.error("useProductWithImages:", err)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const variantImageMap = useMemo(
    () => (product ? buildVariantImageMap(product) : new Map()),
    [product]
  )

  return { product, variantImageMap, loading, error, refetch: fetchProduct }
}
