import type { ComponentType } from "react"

export interface BlockEditorProps {
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
}

// Lazy imports to keep bundle small — each editor is loaded on demand
export const blockEditorRegistry: Record<
  string,
  () => Promise<{ default: ComponentType<BlockEditorProps> }>
> = {
  HERO: () => import("./editors/hero-editor"),
  FEATURED_PRODUCTS: () => import("./editors/featured-products-editor"),
  BANNER: () => import("./editors/banner-editor"),
  RICH_TEXT: () => import("./editors/rich-text-editor"),
  CTA: () => import("./editors/cta-editor"),
}

export const BLOCK_TYPE_LABELS: Record<string, string> = {
  HERO: "Hero Banner",
  FEATURED_PRODUCTS: "Productos Destacados",
  BANNER: "Banner",
  RICH_TEXT: "Texto Enriquecido",
  CTA: "Llamada a Acción",
}

export const BLOCK_TYPE_COLORS: Record<string, string> = {
  HERO: "purple",
  FEATURED_PRODUCTS: "blue",
  BANNER: "orange",
  RICH_TEXT: "green",
  CTA: "red",
}
