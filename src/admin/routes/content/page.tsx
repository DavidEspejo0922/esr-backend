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

interface ContentPage {
  id: string
  title: string
  slug: string
  locale: string
  published: boolean
  blocks?: { id: string }[]
  created_at: string
}

const LOCALES = [
  { code: "es-CO", label: "Colombia" },
  { code: "es-VE", label: "Venezuela" },
  { code: "es-EC", label: "Ecuador" },
] as const

const emptyForm = {
  title: "",
  slug: "",
  locale: "es-CO",
  published: false,
}

const ContentPagesPage = () => {
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLocale, setActiveLocale] = useState("es-CO")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })

  const fetchPages = async () => {
    try {
      const res = await fetch("/admin/content", { credentials: "include" })
      const data = await res.json()
      setPages(data.pages || [])
    } catch {
      toast.error("Error", { description: "No se pudieron cargar las páginas" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const filteredPages = pages.filter((p) => p.locale === activeLocale)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const body = {
      title: form.title,
      slug: form.slug,
      locale: form.locale,
      published: form.published,
    }

    try {
      const url = editingId ? `/admin/content/${editingId}` : "/admin/content"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed")
      }

      toast.success(editingId ? "Actualizada" : "Creada", {
        description: `"${form.title}" guardada correctamente`,
      })

      setForm({ ...emptyForm })
      setShowForm(false)
      setEditingId(null)
      fetchPages()
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "No se pudo guardar la página",
      })
    }
  }

  const handleEdit = (page: ContentPage) => {
    setForm({
      title: page.title,
      slug: page.slug,
      locale: page.locale,
      published: page.published,
    })
    setEditingId(page.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar página "${title}"? Se eliminarán todos sus bloques.`)) return

    try {
      const res = await fetch(`/admin/content/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed")

      toast.success("Eliminada", { description: `"${title}" eliminada` })
      fetchPages()
    } catch {
      toast.error("Error", { description: "No se pudo eliminar" })
    }
  }

  const handleDuplicate = async (page: ContentPage, targetLocale: string) => {
    try {
      // Create the page in the target locale
      const res = await fetch("/admin/content", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          locale: targetLocale,
          published: false,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Failed")
      }

      const { page: newPage } = await res.json()

      // Fetch source page blocks
      const blocksRes = await fetch(`/admin/content/${page.id}`, {
        credentials: "include",
      })
      const { page: sourcePage } = await blocksRes.json()

      // Copy each block to the new page
      if (sourcePage.blocks?.length) {
        for (const block of sourcePage.blocks) {
          await fetch(`/admin/content/${newPage.id}/blocks`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: block.type,
              sort_order: block.sort_order,
              data: block.data,
              medusa_handle: block.medusa_handle,
            }),
          })
        }
      }

      toast.success("Duplicada", {
        description: `"${page.title}" duplicada a ${LOCALES.find((l) => l.code === targetLocale)?.label}`,
      })
      setActiveLocale(targetLocale)
      fetchPages()
    } catch (err: any) {
      toast.error("Error", {
        description: err.message || "No se pudo duplicar",
      })
    }
  }

  const navigateToPage = (pageId: string) => {
    window.location.href = `/app/content/${pageId}`
  }

  return (
    <Container>
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">Contenido</Heading>
        <Button
          variant="primary"
          onClick={() => {
            setForm({ ...emptyForm, locale: activeLocale })
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          <PlusMini />
          Nueva Página
        </Button>
      </div>

      {/* Locale Tabs */}
      <div className="flex gap-2 mb-6">
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            onClick={() => setActiveLocale(loc.code)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeLocale === loc.code
                ? "bg-ui-bg-base-pressed text-ui-fg-base"
                : "bg-ui-bg-subtle text-ui-fg-subtle hover:bg-ui-bg-subtle-hover"
            }`}
          >
            {loc.label}{" "}
            <span className="text-xs opacity-60">
              ({pages.filter((p) => p.locale === loc.code).length})
            </span>
          </button>
        ))}
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-ui-bg-subtle rounded-lg p-6 mb-6">
          <Heading level="h2" className="mb-4">
            {editingId ? "Editar Página" : "Nueva Página"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Página de inicio"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="home"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Idioma</label>
                <Select
                  value={form.locale}
                  onValueChange={(val) => setForm({ ...form, locale: val })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    {LOCALES.map((loc) => (
                      <Select.Item key={loc.code} value={loc.code}>
                        {loc.label} ({loc.code})
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="rounded border-gray-300 w-4 h-4"
                  />
                  <span className="font-medium">Publicada</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="primary" type="submit">
                {editingId ? "Guardar Cambios" : "Crear Página"}
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

      {/* Pages Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No hay páginas para {LOCALES.find((l) => l.code === activeLocale)?.label}
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Título</Table.HeaderCell>
              <Table.HeaderCell>Slug</Table.HeaderCell>
              <Table.HeaderCell>Estado</Table.HeaderCell>
              <Table.HeaderCell>Duplicar a</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredPages.map((page) => (
              <Table.Row key={page.id}>
                <Table.Cell>
                  <button
                    onClick={() => navigateToPage(page.id)}
                    className="font-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                  >
                    {page.title}
                  </button>
                </Table.Cell>
                <Table.Cell className="text-gray-500">{page.slug}</Table.Cell>
                <Table.Cell>
                  <Badge color={page.published ? "green" : "grey"}>
                    {page.published ? "Publicada" : "Borrador"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1">
                    {LOCALES.filter((l) => l.code !== page.locale)
                      .filter(
                        (l) =>
                          !pages.some(
                            (p) => p.slug === page.slug && p.locale === l.code
                          )
                      )
                      .map((l) => (
                        <button
                          key={l.code}
                          onClick={() => handleDuplicate(page, l.code)}
                          className="text-xs px-2 py-1 rounded bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover text-ui-fg-subtle"
                        >
                          {l.label}
                        </button>
                      ))}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToPage(page.id)}
                      className="text-gray-500 hover:text-gray-900"
                      title="Editar bloques"
                    >
                      <PencilSquare />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      className="text-gray-500 hover:text-red-600"
                      title="Eliminar"
                    >
                      <Trash />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Contenido",
})

export default ContentPagesPage
