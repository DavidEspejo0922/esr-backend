import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Button, toast, Toaster } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useState, useCallback, useMemo } from "react"
import { useProductWithImages } from "./hooks/use-product-with-images"
import { useVariantImageBatch } from "./hooks/use-variant-image-batch"
import { VariantSelector } from "./components/variant-selector"
import { ImageGrid } from "./components/image-grid"
import { AssignmentSummary } from "./components/assignment-summary"
import type { PendingChanges } from "./types"

const VariantImagesWidget = () => {
  const { id: productId } = useParams<{ id: string }>()
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  )
  const [pendingChanges, setPendingChanges] = useState<
    Map<string, PendingChanges>
  >(new Map())

  const { product, variantImageMap, loading, error, refetch } =
    useProductWithImages(productId)

  const { saving, saveChanges } = useVariantImageBatch(() => {
    refetch()
  })

  const hasPendingChanges = useMemo(() => {
    for (const changes of pendingChanges.values()) {
      if (changes.add.length > 0 || changes.remove.length > 0) return true
    }
    return false
  }, [pendingChanges])

  const handleImageToggle = useCallback(
    (imageId: string) => {
      if (!selectedVariantId) return

      const serverAssigned =
        variantImageMap.get(selectedVariantId)?.has(imageId) ?? false

      setPendingChanges((prev) => {
        const next = new Map(prev)
        const current = next.get(selectedVariantId) ?? {
          add: [],
          remove: [],
        }

        if (serverAssigned) {
          // Image is assigned on server
          if (current.remove.includes(imageId)) {
            // Cancel pending remove
            current.remove = current.remove.filter((id) => id !== imageId)
          } else {
            // Mark for removal
            current.remove = [...current.remove, imageId]
          }
        } else {
          // Image is NOT assigned on server
          if (current.add.includes(imageId)) {
            // Cancel pending add
            current.add = current.add.filter((id) => id !== imageId)
          } else {
            // Mark for addition
            current.add = [...current.add, imageId]
          }
        }

        next.set(selectedVariantId, { ...current })
        return next
      })
    },
    [selectedVariantId, variantImageMap]
  )

  const handleSave = useCallback(async () => {
    if (!productId) return

    for (const [variantId, changes] of pendingChanges.entries()) {
      if (changes.add.length === 0 && changes.remove.length === 0) continue

      const success = await saveChanges(productId, variantId, changes)
      if (!success) return // Stop on first error, preserve remaining
    }

    setPendingChanges(new Map())
    toast.success("Guardado", {
      description: "Imagenes de variantes actualizadas correctamente",
    })
  }, [productId, pendingChanges, saveChanges])

  const handleCancel = useCallback(() => {
    setPendingChanges(new Map())
  }, [])

  // Don't render if no images or no variants
  if (!loading && product) {
    if (!product.images?.length || !product.variants?.length) {
      return null
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="py-6 text-center text-gray-400 text-sm">
          Cargando imagenes...
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return null
  }

  const serverAssignedIds = selectedVariantId
    ? variantImageMap.get(selectedVariantId) ?? new Set<string>()
    : new Set<string>()

  return (
    <Container>
      <Toaster />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Imagenes por Variante</Heading>
          {hasPendingChanges && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={handleSave}
                disabled={saving}
                isLoading={saving}
              >
                Guardar
              </Button>
            </div>
          )}
        </div>

        <VariantSelector
          variants={product.variants!}
          selectedVariantId={selectedVariantId}
          onSelect={setSelectedVariantId}
          variantImageMap={variantImageMap}
        />

        {selectedVariantId ? (
          <ImageGrid
            images={product.images!}
            serverAssignedIds={serverAssignedIds}
            pendingChanges={pendingChanges.get(selectedVariantId)}
            onToggle={handleImageToggle}
            disabled={saving}
          />
        ) : (
          <div className="py-8 text-center text-gray-400 text-sm">
            Selecciona una variante para asignar imagenes
          </div>
        )}

        <AssignmentSummary
          variants={product.variants!}
          images={product.images!}
          variantImageMap={variantImageMap}
        />
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default VariantImagesWidget
