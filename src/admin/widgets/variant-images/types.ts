export interface ProductImage {
  id: string
  url: string
  rank: number
  variants?: ProductVariantRef[]
}

export interface ProductVariantRef {
  id: string
  title: string | null
  options: ProductOptionValue[] | null
}

export interface ProductOptionValue {
  id: string
  value: string
  option?: { id: string; title: string } | null
}

export interface ProductVariantFull extends ProductVariantRef {
  images: ProductImage[] | null
}

export interface ProductForWidget {
  id: string
  title: string
  images: ProductImage[] | null
  variants: ProductVariantFull[] | null
}

/** variant_id -> Set<image_id> */
export type VariantImageMap = Map<string, Set<string>>

export interface PendingChanges {
  add: string[]
  remove: string[]
}
