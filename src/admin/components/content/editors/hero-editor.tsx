import { Input, Select } from "@medusajs/ui"
import ImageUploader from "../image-uploader"
import type { BlockEditorProps } from "../block-editor-registry"

const HeroEditor = ({ data, onChange }: BlockEditorProps) => {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value })

  return (
    <div className="space-y-6">
      {/* Textos */}
      <details open>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Textos
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <Input
              value={data.title || ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Protección Premium para tu Vida Digital"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Badge</label>
            <Input
              value={data.badge_text || ""}
              onChange={(e) => set("badge_text", e.target.value)}
              placeholder="NUEVO, EXCLUSIVO..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Subtítulo</label>
            <Input
              value={data.subtitle || ""}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Descubre la nueva colección de fundas y accesorios"
            />
          </div>
        </div>
      </details>

      {/* CTAs */}
      <details open>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Llamadas a Acción
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium mb-1">CTA Principal - Texto</label>
            <Input
              value={data.cta_text || ""}
              onChange={(e) => set("cta_text", e.target.value)}
              placeholder="Comprar Ahora"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Principal - Enlace</label>
            <Input
              value={data.cta_link || ""}
              onChange={(e) => set("cta_link", e.target.value)}
              placeholder="/products"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Secundario - Texto</label>
            <Input
              value={data.cta_secondary_text || ""}
              onChange={(e) => set("cta_secondary_text", e.target.value)}
              placeholder="Ver Catálogo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Secundario - Enlace</label>
            <Input
              value={data.cta_secondary_link || ""}
              onChange={(e) => set("cta_secondary_link", e.target.value)}
              placeholder="/catalogo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Principal - Fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.cta_bg_color || "#ffffff"}
                onChange={(e) => set("cta_bg_color", e.target.value)}
                className="w-8 h-8 rounded border border-ui-border-base cursor-pointer"
              />
              <Input
                value={data.cta_bg_color || "#ffffff"}
                onChange={(e) => set("cta_bg_color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Principal - Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.cta_text_color || "#111827"}
                onChange={(e) => set("cta_text_color", e.target.value)}
                className="w-8 h-8 rounded border border-ui-border-base cursor-pointer"
              />
              <Input
                value={data.cta_text_color || "#111827"}
                onChange={(e) => set("cta_text_color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Secundario - Fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.cta_secondary_bg_color || "transparent"}
                onChange={(e) => set("cta_secondary_bg_color", e.target.value)}
                className="w-8 h-8 rounded border border-ui-border-base cursor-pointer"
              />
              <Input
                value={data.cta_secondary_bg_color || "transparent"}
                onChange={(e) => set("cta_secondary_bg_color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Secundario - Borde</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={data.cta_secondary_border_color || "#ffffff80"}
                onChange={(e) => set("cta_secondary_border_color", e.target.value)}
                className="w-8 h-8 rounded border border-ui-border-base cursor-pointer"
              />
              <Input
                value={data.cta_secondary_border_color || "#ffffff80"}
                onChange={(e) => set("cta_secondary_border_color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </details>

      {/* Fondo */}
      <details open>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Fondo
        </summary>
        <div className="space-y-4 pl-4">
          <ImageUploader
            label="Imagen de Fondo (Desktop)"
            value={data.background_image}
            onChange={(url) => set("background_image", url || "")}
          />
          <ImageUploader
            label="Imagen de Fondo (Mobile)"
            value={data.background_image_mobile}
            onChange={(url) => set("background_image_mobile", url)}
          />
          <div>
            <label className="block text-sm font-medium mb-1">URL de Video (MP4)</label>
            <Input
              value={data.background_video_url || ""}
              onChange={(e) => set("background_video_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Color Overlay</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.overlay_color || "#000000"}
                  onChange={(e) => set("overlay_color", e.target.value)}
                  className="w-10 h-10 rounded border border-ui-border-base cursor-pointer"
                />
                <Input
                  value={data.overlay_color || "#000000"}
                  onChange={(e) => set("overlay_color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Opacidad Overlay: {data.overlay_opacity ?? 0.3}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={data.overlay_opacity ?? 0.3}
                onChange={(e) => set("overlay_opacity", parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        </div>
      </details>

      {/* Diseño */}
      <details>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Diseño y Estilo
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium mb-1">Alineación del Texto</label>
            <Select
              value={data.text_alignment || "center"}
              onValueChange={(val) => set("text_alignment", val)}
            >
              <Select.Trigger><Select.Value /></Select.Trigger>
              <Select.Content>
                <Select.Item value="left">Izquierda</Select.Item>
                <Select.Item value="center">Centro</Select.Item>
                <Select.Item value="right">Derecha</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Posición Vertical</label>
            <Select
              value={data.vertical_position || "center"}
              onValueChange={(val) => set("vertical_position", val)}
            >
              <Select.Trigger><Select.Value /></Select.Trigger>
              <Select.Content>
                <Select.Item value="top">Arriba</Select.Item>
                <Select.Item value="center">Centro</Select.Item>
                <Select.Item value="bottom">Abajo</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Variante de Layout</label>
            <Select
              value={data.layout_variant || "full_width"}
              onValueChange={(val) => set("layout_variant", val)}
            >
              <Select.Trigger><Select.Value /></Select.Trigger>
              <Select.Content>
                <Select.Item value="full_width">Ancho Completo</Select.Item>
                <Select.Item value="split">Dividido (texto a un lado)</Select.Item>
                <Select.Item value="minimal">Mínimo (compacto)</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altura</label>
            <Select
              value={data.height || "full_screen"}
              onValueChange={(val) => set("height", val)}
            >
              <Select.Trigger><Select.Value /></Select.Trigger>
              <Select.Content>
                <Select.Item value="full_screen">Pantalla Completa</Select.Item>
                <Select.Item value="large">Grande (700px)</Select.Item>
                <Select.Item value="medium">Mediano (500px)</Select.Item>
              </Select.Content>
            </Select>
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
        </div>
      </details>

      {/* Programación */}
      <details>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Programación
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium mb-1">Inicio</label>
            <Input
              type="datetime-local"
              value={data.schedule_start || ""}
              onChange={(e) => set("schedule_start", e.target.value || null)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Vacío = siempre visible
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin</label>
            <Input
              type="datetime-local"
              value={data.schedule_end || ""}
              onChange={(e) => set("schedule_end", e.target.value || null)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Vacío = sin fecha de expiración
            </p>
          </div>
        </div>
      </details>

      {/* Animación */}
      <details>
        <summary className="text-sm font-semibold cursor-pointer select-none mb-3">
          Animación
        </summary>
        <div className="pl-4">
          <label className="block text-sm font-medium mb-1">Efecto</label>
          <Select
            value={data.animation || "parallax"}
            onValueChange={(val) => set("animation", val)}
          >
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="parallax">Parallax</Select.Item>
              <Select.Item value="fade">Fade</Select.Item>
              <Select.Item value="none">Sin animación</Select.Item>
            </Select.Content>
          </Select>
        </div>
      </details>
    </div>
  )
}

export default HeroEditor
