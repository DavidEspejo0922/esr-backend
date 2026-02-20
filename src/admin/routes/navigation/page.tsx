import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"
import {
  Container,
  Heading,
  Table,
  Button,
  Input,
  Select,
  Badge,
  Toaster,
  toast,
} from "@medusajs/ui"
import { PlusMini, Trash, PencilSquare } from "@medusajs/icons"

interface TranslationFields {
  label?: string
  badge_text?: string
}

interface NavItem {
  id: string
  label: string
  slug: string
  url: string | null
  sort_order: number
  is_visible: boolean
  position: string
  source_type: string | null
  source_id: string | null
  parent_id: string | null
  badge_text: string | null
  highlight_color: string | null
  translations: Record<string, TranslationFields> | null
}

const POSITIONS = ["HEADER", "FOOTER", "MOBILE_MENU"] as const
const SOURCE_TYPES = [
  "PRODUCT_CATEGORY",
  "DEVICE_BRAND",
  "DEVICE_SERIES",
  "CUSTOM_URL",
  "PRODUCT_COLLECTION",
] as const

const NON_DEFAULT_LOCALES = [
  { code: "es-VE", label: "Venezuela" },
  { code: "es-EC", label: "Ecuador" },
] as const

const positionLabels: Record<string, string> = {
  HEADER: "Header",
  FOOTER: "Footer",
  MOBILE_MENU: "Menú Móvil",
}

const emptyForm = {
  label: "",
  slug: "",
  url: "",
  sort_order: 0,
  is_visible: true,
  position: "HEADER",
  source_type: "",
  source_id: "",
  parent_id: "",
  badge_text: "",
  highlight_color: "",
  same_for_all: true,
  translations: {} as Record<string, TranslationFields>,
}

const NavigationPage = () => {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("HEADER")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchItems = async () => {
    try {
      const res = await fetch("/admin/navigation", { credentials: "include" })
      const data = await res.json()
      setItems(data.nav_items || [])
    } catch {
      toast.error("Error", { description: "No se pudieron cargar los elementos" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = items.filter((item) => item.position === activeTab)
  const parentItems = filteredItems.filter((item) => !item.parent_id)
  const childrenOf = (parentId: string) =>
    filteredItems.filter((item) => item.parent_id === parentId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Build translations: only include locales that have non-empty values
    let translations: Record<string, TranslationFields> | null = null
    if (!form.same_for_all) {
      const filtered: Record<string, TranslationFields> = {}
      for (const loc of NON_DEFAULT_LOCALES) {
        const entry = form.translations[loc.code]
        if (entry?.label || entry?.badge_text) {
          filtered[loc.code] = {}
          if (entry.label) filtered[loc.code].label = entry.label
          if (entry.badge_text) filtered[loc.code].badge_text = entry.badge_text
        }
      }
      if (Object.keys(filtered).length > 0) {
        translations = filtered
      }
    }

    const body: Record<string, any> = {
      label: form.label,
      slug: form.slug,
      position: form.position,
      sort_order: Number(form.sort_order),
      is_visible: form.is_visible,
      url: form.url || null,
      source_type: form.source_type || null,
      source_id: form.source_id || null,
      parent_id: form.parent_id || null,
      badge_text: form.badge_text || null,
      highlight_color: form.highlight_color || null,
      translations,
    }

    try {
      const url = editingId
        ? `/admin/navigation/${editingId}`
        : "/admin/navigation"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed")

      toast.success(editingId ? "Actualizado" : "Creado", {
        description: `"${form.label}" guardado correctamente`,
      })

      setForm({ ...emptyForm })
      setShowForm(false)
      setEditingId(null)
      fetchItems()
    } catch {
      toast.error("Error", { description: "No se pudo guardar el elemento" })
    }
  }

  const handleEdit = (item: NavItem) => {
    setForm({
      label: item.label,
      slug: item.slug,
      url: item.url || "",
      sort_order: item.sort_order,
      is_visible: item.is_visible,
      position: item.position,
      source_type: item.source_type || "",
      source_id: item.source_id || "",
      parent_id: item.parent_id || "",
      badge_text: item.badge_text || "",
      highlight_color: item.highlight_color || "",
      same_for_all: !item.translations,
      translations: item.translations || {},
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`¿Eliminar "${label}"?`)) return

    try {
      const res = await fetch(`/admin/navigation/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed")

      toast.success("Eliminado", { description: `"${label}" eliminado` })
      fetchItems()
    } catch {
      toast.error("Error", { description: "No se pudo eliminar" })
    }
  }

  const hasTranslations = (item: NavItem) =>
    item.translations && Object.keys(item.translations).length > 0

  const renderRow = (item: NavItem, isChild = false) => (
    <Table.Row key={item.id}>
      <Table.Cell>
        <div>
          <span className={isChild ? "pl-6 text-gray-600" : "font-medium"}>
            {isChild ? "└ " : ""}
            {item.label}
          </span>
          {hasTranslations(item) && (
            <span className="ml-2 text-[10px] text-blue-500 font-medium">i18n</span>
          )}
        </div>
      </Table.Cell>
      <Table.Cell className="text-gray-500">{item.slug}</Table.Cell>
      <Table.Cell className="text-gray-500">{item.url || "—"}</Table.Cell>
      <Table.Cell>{item.sort_order}</Table.Cell>
      <Table.Cell>
        <Badge color={item.is_visible ? "green" : "grey"}>
          {item.is_visible ? "Visible" : "Oculto"}
        </Badge>
      </Table.Cell>
      <Table.Cell>
        {item.badge_text && (
          <Badge color="purple">{item.badge_text}</Badge>
        )}
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-gray-500 hover:text-gray-900"
          >
            <PencilSquare />
          </button>
          <button
            onClick={() => handleDelete(item.id, item.label)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash />
          </button>
        </div>
      </Table.Cell>
    </Table.Row>
  )

  return (
    <Container>
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Navegación</Heading>
        <Button
          variant="primary"
          onClick={() => {
            setForm({ ...emptyForm, position: activeTab })
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          <PlusMini />
          Agregar Elemento
        </Button>
      </div>

      {/* Position Tabs */}
      <div className="flex gap-2 mb-6">
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            onClick={() => setActiveTab(pos)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === pos
                ? "bg-ui-bg-base-pressed text-ui-fg-base"
                : "bg-ui-bg-subtle text-ui-fg-subtle hover:bg-ui-bg-subtle-hover"
            }`}
          >
            {positionLabels[pos]}{" "}
            <span className="text-xs opacity-60">
              ({items.filter((i) => i.position === pos).length})
            </span>
          </button>
        ))}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-ui-bg-subtle rounded-lg p-6 mb-6">
          <Heading level="h2" className="mb-4">
            {editingId ? "Editar Elemento" : "Nuevo Elemento"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Label * <span className="text-xs text-gray-400">(Colombia)</span>
                </label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Productos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="productos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="/products"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Posición</label>
                <Select
                  value={form.position}
                  onValueChange={(val) => setForm({ ...form, position: val })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {POSITIONS.map((pos) => (
                      <Select.Item key={pos} value={pos}>
                        {positionLabels[pos]}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Orden</label>
                <Input
                  type="number"
                  value={String(form.sort_order)}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Padre</label>
                <Select
                  value={form.parent_id || "__none__"}
                  onValueChange={(val) =>
                    setForm({ ...form, parent_id: val === "__none__" ? "" : val })
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="__none__">Ninguno (raíz)</Select.Item>
                    {items
                      .filter((i) => !i.parent_id)
                      .map((i) => (
                        <Select.Item key={i.id} value={i.id}>
                          {i.label} ({positionLabels[i.position]})
                        </Select.Item>
                      ))}
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo Fuente</label>
                <Select
                  value={form.source_type || "__none__"}
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      source_type: val === "__none__" ? "" : val,
                    })
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="__none__">Ninguno</Select.Item>
                    {SOURCE_TYPES.map((st) => (
                      <Select.Item key={st} value={st}>
                        {st}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Badge</label>
                <Input
                  value={form.badge_text}
                  onChange={(e) =>
                    setForm({ ...form, badge_text: e.target.value })
                  }
                  placeholder="Nuevo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <Input
                  value={form.highlight_color}
                  onChange={(e) =>
                    setForm({ ...form, highlight_color: e.target.value })
                  }
                  placeholder="#ff0000"
                />
              </div>
            </div>

            {/* Locale translations section */}
            <div className="mt-6 border-t border-ui-border-base pt-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.same_for_all}
                  onChange={(e) =>
                    setForm({ ...form, same_for_all: e.target.checked })
                  }
                  className="rounded border-gray-300 w-4 h-4"
                />
                <span className="font-medium">Igual para todos los países</span>
                <span className="text-gray-400 text-xs">
                  (Desmarca para personalizar por país)
                </span>
              </label>

              {!form.same_for_all && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-ui-bg-base rounded-lg border border-ui-border-base">
                  {NON_DEFAULT_LOCALES.map((loc) => (
                    <div key={loc.code}>
                      <label className="block text-sm font-medium mb-1">
                        Label ({loc.label})
                      </label>
                      <Input
                        value={form.translations[loc.code]?.label || ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            translations: {
                              ...form.translations,
                              [loc.code]: {
                                ...form.translations[loc.code],
                                label: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder={`Vacío = mismo que "${form.label || "Label principal"}"`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="primary" type="submit">
                {editingId ? "Guardar Cambios" : "Crear"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setForm({ ...emptyForm })
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay elementos de navegación en {positionLabels[activeTab]}
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Label</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>URL</Table.HeaderCell>
              <Table.HeaderCell>Orden</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Badge</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {parentItems.map((parent) => (
              <>
                {renderRow(parent)}
                {childrenOf(parent.id).map((child) => renderRow(child, true))}
              </>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Navegación",
})

export default NavigationPage
