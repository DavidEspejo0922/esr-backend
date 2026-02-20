import { useState, useCallback } from "react"
import { toast } from "@medusajs/ui"
import type { PendingChanges } from "../types"

interface UseVariantImageBatchReturn {
  saving: boolean
  saveChanges: (
    productId: string,
    variantId: string,
    changes: PendingChanges
  ) => Promise<boolean>
}

export function useVariantImageBatch(
  onSuccess: () => void
): UseVariantImageBatchReturn {
  const [saving, setSaving] = useState(false)

  const saveChanges = useCallback(
    async (
      productId: string,
      variantId: string,
      changes: PendingChanges
    ): Promise<boolean> => {
      if (changes.add.length === 0 && changes.remove.length === 0) {
        return true
      }

      setSaving(true)

      try {
        const res = await fetch(
          `/admin/products/${productId}/variants/${variantId}/images/batch`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              add: changes.add,
              remove: changes.remove,
            }),
          }
        )

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            body.message || `Error ${res.status}: ${res.statusText}`
          )
        }

        onSuccess()
        return true
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error desconocido"
        toast.error("Error", {
          description: `No se pudieron guardar los cambios: ${message}`,
        })
        console.error("useVariantImageBatch:", err)
        return false
      } finally {
        setSaving(false)
      }
    },
    [onSuccess]
  )

  return { saving, saveChanges }
}
