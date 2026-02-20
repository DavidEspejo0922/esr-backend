import { Input, Select, Button } from "@medusajs/ui"
import { PlusMini, Trash } from "@medusajs/icons"
import type { BlockEditorProps } from "../block-editor-registry"

interface Feature {
  icon: string
  title: string
  description: string
}

const RichTextEditor = ({ data, onChange }: BlockEditorProps) => {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value })

  const displayMode = data.display_mode || "features_grid"
  const features: Feature[] = data.features || []

  const updateFeature = (idx: number, field: keyof Feature, value: string) => {
    const updated = [...features]
    updated[idx] = { ...updated[idx], [field]: value }
    set("features", updated)
  }

  const addFeature = () => {
    set("features", [...features, { icon: "", title: "", description: "" }])
  }

  const removeFeature = (idx: number) => {
    set(
      "features",
      features.filter((_, i) => i !== idx)
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <Input
            value={data.title || ""}
            onChange={(e) => set("title", e.target.value)}
            placeholder="¿Por qué elegir ESR?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Modo de Visualización</label>
          <Select
            value={displayMode}
            onValueChange={(val) => set("display_mode", val)}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="features_grid">Grilla de Características</Select.Item>
              <Select.Item value="prose">Texto Libre (HTML)</Select.Item>
              <Select.Item value="faq">Preguntas Frecuentes</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </div>

      {displayMode === "prose" && (
        <div>
          <label className="block text-sm font-medium mb-1">Contenido HTML</label>
          <textarea
            value={data.body_html || ""}
            onChange={(e) => set("body_html", e.target.value)}
            className="w-full border border-ui-border-base rounded-lg px-3 py-2 text-sm min-h-[200px] resize-y font-mono"
            placeholder="<h2>Título</h2><p>Contenido...</p>"
          />
        </div>
      )}

      {(displayMode === "features_grid" || displayMode === "faq") && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {displayMode === "faq" ? "Preguntas" : "Características"} ({features.length})
            </label>
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={addFeature}
            >
              <PlusMini />
              Agregar
            </Button>
          </div>
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[80px_1fr_1fr_32px] gap-2 items-start p-3 bg-ui-bg-base rounded-lg border border-ui-border-base"
              >
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {displayMode === "faq" ? "#" : "Ícono"}
                  </label>
                  <Input
                    value={feature.icon}
                    onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                    placeholder={displayMode === "faq" ? String(idx + 1) : "shield"}
                    size="small"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {displayMode === "faq" ? "Pregunta" : "Título"}
                  </label>
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(idx, "title", e.target.value)}
                    placeholder={displayMode === "faq" ? "¿Cómo funciona?" : "Protección Militar"}
                    size="small"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {displayMode === "faq" ? "Respuesta" : "Descripción"}
                  </label>
                  <Input
                    value={feature.description}
                    onChange={(e) => updateFeature(idx, "description", e.target.value)}
                    placeholder="Certificación de caída militar..."
                    size="small"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(idx)}
                  className="mt-5 text-gray-400 hover:text-red-500"
                >
                  <Trash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Columnas</label>
          <Select
            value={String(data.columns || 4)}
            onValueChange={(val) => set("columns", parseInt(val))}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="2">2</Select.Item>
              <Select.Item value="3">3</Select.Item>
              <Select.Item value="4">4</Select.Item>
            </Select.Content>
          </Select>
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
    </div>
  )
}

export default RichTextEditor
