import { Input, Select } from "@medusajs/ui"
import ImageUploader from "../image-uploader"
import type { BlockEditorProps } from "../block-editor-registry"

const BannerEditor = ({ data, onChange }: BlockEditorProps) => {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <Input
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Nueva Serie iPhone 16"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <Input
            value={data.description || ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Fundas diseñadas específicamente..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Texto</label>
          <Input
            value={data.cta_text || ""}
            onChange={(e) => set("cta_text", e.target.value)}
            placeholder="Ver Colección"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Enlace</label>
          <Input
            value={data.cta_link || ""}
            onChange={(e) => set("cta_link", e.target.value)}
            placeholder="/collections/iphone-16"
          />
        </div>
      </div>

      <ImageUploader
        label="Imagen del Banner"
        value={data.image}
        onChange={(url) => set("image", url)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color de Fondo</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.background_color || "#1a1a1a"}
              onChange={(e) => set("background_color", e.target.value)}
              className="w-10 h-10 rounded border border-ui-border-base cursor-pointer"
            />
            <Input
              value={data.background_color || "#1a1a1a"}
              onChange={(e) => set("background_color", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Color del Texto</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.text_color || "#ffffff"}
              onChange={(e) => set("text_color", e.target.value)}
              className="w-10 h-10 rounded border border-ui-border-base cursor-pointer"
            />
            <Input
              value={data.text_color || "#ffffff"}
              onChange={(e) => set("text_color", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <Select
            value={data.layout || "text_left_image_right"}
            onValueChange={(val) => set("layout", val)}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="text_left_image_right">Texto izq / Imagen der</Select.Item>
              <Select.Item value="text_right_image_left">Texto der / Imagen izq</Select.Item>
              <Select.Item value="text_center">Texto centrado</Select.Item>
              <Select.Item value="image_full">Solo imagen</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default BannerEditor
