import { useState } from "react"
import type { ProductImage } from "../types"

interface ImageCardProps {
  image: ProductImage
  isAssigned: boolean
  isPendingAdd: boolean
  isPendingRemove: boolean
  onToggle: () => void
  disabled: boolean
}

export function ImageCard({
  image,
  isAssigned,
  isPendingAdd,
  isPendingRemove,
  onToggle,
  disabled,
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false)

  const borderColor = isPendingAdd
    ? "border-green-500"
    : isPendingRemove
      ? "border-red-500"
      : isAssigned
        ? "border-blue-500"
        : "border-transparent"

  const overlayClasses = isPendingRemove
    ? "opacity-50"
    : !isAssigned && !isPendingAdd
      ? "grayscale opacity-60"
      : ""

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative aspect-square rounded-lg overflow-hidden border-3
        ${borderColor}
        transition-all duration-200 hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-400
        disabled:cursor-not-allowed disabled:hover:scale-100
      `}
      style={{ borderWidth: "3px" }}
    >
      {imgError ? (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
          Sin imagen
        </div>
      ) : (
        <img
          src={image.url}
          alt={`Imagen ${image.rank + 1}`}
          className={`w-full h-full object-cover ${overlayClasses}`}
          onError={() => setImgError(true)}
        />
      )}

      {/* Status overlay icon */}
      {(isAssigned || isPendingAdd || isPendingRemove) && (
        <div
          className={`
            absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold
            ${isPendingAdd ? "bg-green-500" : ""}
            ${isPendingRemove ? "bg-red-500" : ""}
            ${isAssigned && !isPendingRemove ? "bg-blue-500" : ""}
          `}
        >
          {isPendingAdd && "+"}
          {isPendingRemove && "\u00d7"}
          {isAssigned && !isPendingRemove && "\u2713"}
        </div>
      )}
    </button>
  )
}
