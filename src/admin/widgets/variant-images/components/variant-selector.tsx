import { Badge } from "@medusajs/ui"
import type { ProductVariantFull, VariantImageMap } from "../types"

interface VariantSelectorProps {
  variants: ProductVariantFull[]
  selectedVariantId: string | null
  onSelect: (variantId: string) => void
  variantImageMap: VariantImageMap
}

function getVariantLabel(variant: ProductVariantFull): string {
  if (variant.options?.length) {
    return variant.options.map((o) => o.value).join(" / ")
  }
  return variant.title || variant.id.slice(0, 8)
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  variantImageMap,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariantId
        const imageCount = variantImageMap.get(variant.id)?.size ?? 0

        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-150
              ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            <span>{getVariantLabel(variant)}</span>
            <Badge
              size="2xsmall"
              color={imageCount > 0 ? (isSelected ? "blue" : "green") : "grey"}
            >
              {imageCount}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
