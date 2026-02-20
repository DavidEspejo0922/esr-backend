import { ImageCard } from "./image-card"
import type { ProductImage, PendingChanges } from "../types"

interface ImageGridProps {
  images: ProductImage[]
  serverAssignedIds: Set<string>
  pendingChanges: PendingChanges | undefined
  onToggle: (imageId: string) => void
  disabled: boolean
}

export function ImageGrid({
  images,
  serverAssignedIds,
  pendingChanges,
  onToggle,
  disabled,
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {images.map((image) => {
        const isServerAssigned = serverAssignedIds.has(image.id)
        const isPendingAdd = pendingChanges?.add.includes(image.id) ?? false
        const isPendingRemove =
          pendingChanges?.remove.includes(image.id) ?? false

        const isAssigned =
          (isServerAssigned && !isPendingRemove) ||
          (!isServerAssigned && isPendingAdd)

        return (
          <ImageCard
            key={image.id}
            image={image}
            isAssigned={isAssigned}
            isPendingAdd={isPendingAdd}
            isPendingRemove={isPendingRemove}
            onToggle={() => onToggle(image.id)}
            disabled={disabled}
          />
        )
      })}
    </div>
  )
}
