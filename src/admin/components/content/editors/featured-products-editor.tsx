import { Input, Select } from "@medusajs/ui"
import type { BlockEditorProps } from "../block-editor-registry"

const FeaturedProductsEditor = ({ data, onChange }: BlockEditorProps) => {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value })

  const productIdsText = (data.product_ids || []).join(", ")

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <Input
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Productos Destacados"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtítulo</label>
          <Input
            value={data.subtitle || ""}
            onChange={(e) => set("subtitle", e.target.value)}
            placeholder="Los favoritos de nuestros clientes"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">IDs de Productos</label>
        <textarea
          value={productIdsText}
          onChange={(e) => {
            const ids = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
            set("product_ids", ids)
          }}
          className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm min-h-[80px] resize-y"
          placeholder="prod_01ABC, prod_02DEF, prod_03GHI"
        />
        <p className="text-xs text-gray-400 mt-1">
          Separar IDs de producto con comas. Se pueden obtener desde Productos en el menú lateral.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Layout</label>
          <Select
            value={data.layout || "grid"}
            onValueChange={(val) => set("layout", val)}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="grid">Grilla</Select.Item>
              <Select.Item value="carousel">Carrusel</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Columnas</label>
          <Select
            value={String(data.max_columns || 4)}
            onValueChange={(val) => set("max_columns", parseInt(val))}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="2">2</Select.Item>
              <Select.Item value="3">3</Select.Item>
              <Select.Item value="4">4</Select.Item>
            </Select.Content>
          </Select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={data.show_prices !== false}
              onChange={(e) => set("show_prices", e.target.checked)}
              className="rounded border-gray-300 w-4 h-4"
            />
            <span className="font-medium">Mostrar Precios</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Color de Fondo</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={data.background_color || "#ffffff"}
            onChange={(e) => set("background_color", e.target.value)}
            className="w-10 h-10 rounded border border-ui-border-base cursor-pointer"
          />
          <Input
            value={data.background_color || "#ffffff"}
            onChange={(e) => set("background_color", e.target.value)}
            className="w-40"
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturedProductsEditor
