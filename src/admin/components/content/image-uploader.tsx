import { useState, useRef } from "react"
import { Button } from "@medusajs/ui"
import { Trash } from "@medusajs/icons"

interface ImageUploaderProps {
  label: string
  value: string | undefined
  onChange: (url: string | undefined) => void
}

const ImageUploader = ({ label, value, onChange }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const res = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      const url = data.files?.[0]?.url
      if (url) {
        onChange(url)
      }
    } catch {
      alert("Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
    e.target.value = ""
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {value ? (
        <div className="flex items-start gap-3">
          <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-ui-border-base bg-ui-bg-subtle">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = ""
                ;(e.target as HTMLImageElement).alt = "Error"
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-xs text-gray-500 border border-ui-border-base rounded px-2 py-1 w-64"
              placeholder="URL de la imagen"
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Subiendo..." : "Cambiar"}
              </Button>
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir Imagen"}
          </Button>
          <span className="text-xs text-gray-400">o</span>
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value)
            }}
            className="text-sm border border-ui-border-base rounded px-2 py-1 w-64"
            placeholder="Pegar URL de imagen"
          />
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/mp4"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageUploader
