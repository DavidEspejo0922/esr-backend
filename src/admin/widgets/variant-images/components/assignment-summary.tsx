import type {
  ProductVariantFull,
  ProductImage,
  VariantImageMap,
} from "../types"

interface AssignmentSummaryProps {
  variants: ProductVariantFull[]
  images: ProductImage[]
  variantImageMap: VariantImageMap
}

function getVariantLabel(variant: ProductVariantFull): string {
  if (variant.options?.length) {
    return variant.options.map((o) => o.value).join(" / ")
  }
  return variant.title || variant.id.slice(0, 8)
}

export function AssignmentSummary({
  variants,
  images,
  variantImageMap,
}: AssignmentSummaryProps) {
  const allAssignedImageIds = new Set<string>()
  for (const imageIds of variantImageMap.values()) {
    for (const id of imageIds) {
      allAssignedImageIds.add(id)
    }
  }

  const unassignedCount = images.filter(
    (img) => !allAssignedImageIds.has(img.id)
  ).length

  return (
    <details className="mt-4">
      <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 select-none">
        Resumen de asignaciones
      </summary>
      <div className="mt-2 space-y-1 text-sm">
        {variants.map((variant) => {
          const count = variantImageMap.get(variant.id)?.size ?? 0
          return (
            <div key={variant.id} className="flex items-center gap-2">
              {count === 0 && (
                <span className="text-amber-500" title="Sin imagenes">
                  !
                </span>
              )}
              <span className="text-gray-700">{getVariantLabel(variant)}:</span>
              <span className={count > 0 ? "text-green-600" : "text-gray-400"}>
                {count} {count === 1 ? "imagen" : "imagenes"}
              </span>
            </div>
          )
        })}
        {unassignedCount > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="text-gray-400">
              Sin asignar: {unassignedCount}{" "}
              {unassignedCount === 1 ? "imagen" : "imagenes"}
            </span>
          </div>
        )}
      </div>
    </details>
  )
}
