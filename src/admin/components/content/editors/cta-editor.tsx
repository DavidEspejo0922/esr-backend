import { Input, Select } from "@medusajs/ui"
import ImageUploader from "../image-uploader"
import type { BlockEditorProps } from "../block-editor-registry"

const CTAEditor = ({ data, onChange }: BlockEditorProps) => {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <Input
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Únete a millones de clientes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtítulo</label>
          <Input
            value={data.subtitle || ""}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="Más de 100 millones de productos vendidos"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Texto *</label>
          <Input
            value={data.cta_text || ""}
            onChange={(e) => set("cta_text", e.target.value)}
            placeholder="Explorar Productos"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Enlace *</label>
          <Input
            value={data.cta_link || ""}
            onChange={(e) => set("cta_link", e.target.value)}
            placeholder="/products"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Secundario Texto</label>
          <Input
            value={data.cta_secondary_text || ""}
            onChange={(e) => set("cta_secondary_text", e.target.value)}
            placeholder="Contactar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CTA Secundario Enlace</label>
          <Input
            value={data.cta_secondary_link || ""}
            onChange={(e) => set("cta_secondary_link", e.target.value)}
            placeholder="/contacto"
          />
        </div>
      </div>

      <ImageUploader
        label="Imagen de Fondo"
        value={data.background_image}
        onChange={(url) => set("background_image", url)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Color de Fondo</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={data.background_color || "#0066ff"}
              onChange={(e) => set("background_color", e.target.value)}
              className="w-10 h-10 rounded border border-ui-border-base cursor-pointer"
            />
            <Input
              value={data.background_color || "#0066ff"}
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
            value={data.layout || "centered"}
            onValueChange={(val) => set("layout", val)}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="centered">Centrado</Select.Item>
              <Select.Item value="left_aligned">Alineado a la Izquierda</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default CTAEditor
