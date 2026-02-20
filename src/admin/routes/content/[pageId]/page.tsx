import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState, lazy, Suspense } from "react"
import { useParams } from "react-router-dom"
import {
  Container,
  Heading,
  Table,
  Button,
  Select,
  Badge,
  Toaster,
  toast,
} from "@medusajs/ui"
import {
  PlusMini,
  Trash,
  PencilSquare,
  ArrowUpMini,
  ArrowDownMini,
  ArrowLongLeft,
} from "@medusajs/icons"
import {
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_COLORS,
  type BlockEditorProps,
} from "../../../components/content/block-editor-registry"

interface ContentBlock {
  id: string
  type: string
  sort_order: number
  data: Record<string, any>
  medusa_handle: string | null
}

interface ContentPage {
  id: string
  title: string
  slug: string
  locale: string
  published: boolean
  blocks: ContentBlock[]
}

const BLOCK_TYPES = Object.keys(BLOCK_TYPE_LABELS)

// Lazy-load editors
const editorComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<BlockEditorProps>>
> = {
  HERO: lazy(() => import("../../../components/content/editors/hero-editor")),
  FEATURED_PRODUCTS: lazy(() => import("../../../components/content/editors/featured-products-editor")),
  BANNER: lazy(() => import("../../../components/content/editors/banner-editor")),
  RICH_TEXT: lazy(() => import("../../../components/content/editors/rich-text-editor")),
  CTA: lazy(() => import("../../../components/content/editors/cta-editor")),
}

const ContentPageDetail = () => {
  const { pageId } = useParams<{ pageId: string }>()
  const [page, setPage] = useState<ContentPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [creatingType, setCreatingType] = useState<string | null>(null)
  const [blockData, setBlockData] = useState<Record<string, any>>({})

  const fetchPage = async () => {
    try {
      const res = await fetch(`/admin/content/${pageId}`, { credentials: "include" })
      if (!res.ok) throw new Error("Not found")
      const data = await res.json()
      setPage(data.page)
    } catch {
      toast.error("Error", { description: "No se pudo cargar la página" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (pageId) fetchPage()
  }, [pageId])

  const handleTogglePublished = async () => {
    if (!page) return
    try {
      const res = await fetch(`/admin/content/${page.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !page.published }),
      })
      if (!res.ok) throw new Error("Failed")
      setPage({ ...page, published: !page.published })
      toast.success(page.published ? "Despublicada" : "Publicada")
    } catch {
      toast.error("Error", { description: "No se pudo actualizar" })
    }
  }

  const handleMoveBlock = async (blockId: string, direction: "up" | "down") => {
    if (!page) return
    const blocks = [...page.blocks]
    const idx = blocks.findIndex((b) => b.id === blockId)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= blocks.length) return

    // Swap sort_order values
    const tempOrder = blocks[idx].sort_order
    blocks[idx].sort_order = blocks[swapIdx].sort_order
    blocks[swapIdx].sort_order = tempOrder

    // Re-sort
    blocks.sort((a, b) => a.sort_order - b.sort_order)
    setPage({ ...page, blocks })

    try {
      await fetch(`/admin/content/${page.id}/blocks`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocks: blocks.map((b) => ({ id: b.id, sort_order: b.sort_order })),
        }),
      })
    } catch {
      toast.error("Error", { description: "No se pudo reordenar" })
      fetchPage()
    }
  }

  const handleCreateBlock = async () => {
    if (!page || !creatingType) return
    try {
      const maxOrder = page.blocks.reduce(
        (max, b) => Math.max(max, b.sort_order),
        -1
      )
      const res = await fetch(`/admin/content/${page.id}/blocks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: creatingType,
          sort_order: maxOrder + 1,
          data: blockData,
        }),
      })
      if (!res.ok) throw new Error("Failed")

      toast.success("Bloque creado")
      setCreatingType(null)
      setBlockData({})
      fetchPage()
    } catch {
      toast.error("Error", { description: "No se pudo crear el bloque" })
    }
  }

  const handleUpdateBlock = async () => {
    if (!page || !editingBlock) return
    try {
      const res = await fetch(
        `/admin/content/${page.id}/blocks/${editingBlock.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: blockData }),
        }
      )
      if (!res.ok) throw new Error("Failed")

      toast.success("Bloque actualizado")
      setEditingBlock(null)
      setBlockData({})
      fetchPage()
    } catch {
      toast.error("Error", { description: "No se pudo actualizar el bloque" })
    }
  }

  const handleDeleteBlock = async (blockId: string, type: string) => {
    if (!page) return
    if (!confirm(`¿Eliminar bloque ${BLOCK_TYPE_LABELS[type] || type}?`)) return

    try {
      const res = await fetch(`/admin/content/${page.id}/blocks/${blockId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed")

      toast.success("Bloque eliminado")
      fetchPage()
    } catch {
      toast.error("Error", { description: "No se pudo eliminar" })
    }
  }

  const startEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setBlockData({ ...block.data })
    setCreatingType(null)
  }

  const startCreate = () => {
    setCreatingType("HERO")
    setBlockData({})
    setEditingBlock(null)
  }

  const cancelEditor = () => {
    setEditingBlock(null)
    setCreatingType(null)
    setBlockData({})
  }

  const activeType = editingBlock?.type || creatingType
  const EditorComponent = activeType ? editorComponents[activeType] : null

  if (loading) {
    return (
      <Container>
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      </Container>
    )
  }

  if (!page) {
    return (
      <Container>
        <div className="text-center py-12 text-gray-500">Página no encontrada</div>
      </Container>
    )
  }

  return (
    <Container>
      <Toaster />

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/app/content")}
          className="flex items-center gap-1 text-sm text-ui-fg-subtle hover:text-ui-fg-base mb-4"
        >
          <ArrowLongLeft />
          Volver a Contenido
        </button>

        <div className="flex items-center justify-between">
          <div>
            <Heading level="h1">{page.title}</Heading>
            <p className="text-sm text-gray-500 mt-1">
              /{page.slug} &middot; {page.locale}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={page.published ? "primary" : "secondary"}
              size="small"
              onClick={handleTogglePublished}
            >
              {page.published ? "Publicada" : "Borrador"}
            </Button>
          </div>
        </div>
      </div>

      {/* Blocks List */}
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">
          Bloques ({page.blocks.length})
        </Heading>
        <Button variant="primary" size="small" onClick={startCreate}>
          <PlusMini />
          Agregar Bloque
        </Button>
      </div>

      {page.blocks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-ui-bg-subtle rounded-lg">
          No hay bloques. Agrega uno para comenzar.
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="w-20">Orden</Table.HeaderCell>
              <Table.HeaderCell>Tipo</Table.HeaderCell>
              <Table.HeaderCell>Vista Previa</Table.HeaderCell>
              <Table.HeaderCell className="w-28">Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {page.blocks.map((block, idx) => (
              <Table.Row key={block.id}>
                <Table.Cell>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveBlock(block.id, "up")}
                      disabled={idx === 0}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUpMini />
                    </button>
                    <button
                      onClick={() => handleMoveBlock(block.id, "down")}
                      disabled={idx === page.blocks.length - 1}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDownMini />
                    </button>
                    <span className="text-xs text-gray-400 ml-1">{block.sort_order}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={BLOCK_TYPE_COLORS[block.type] as any || "grey"}>
                    {BLOCK_TYPE_LABELS[block.type] || block.type}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-sm text-gray-500 truncate max-w-xs">
                  {block.data?.title || block.data?.cta_text || "—"}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(block)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <PencilSquare />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block.id, block.type)}
                      className="text-gray-500 hover:text-red-600"
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

      {/* Block Editor */}
      {(editingBlock || creatingType) && (
        <div className="mt-6 bg-ui-bg-subtle rounded-lg p-6 border border-ui-border-base">
          <div className="flex items-center justify-between mb-4">
            <Heading level="h2">
              {editingBlock
                ? `Editar ${BLOCK_TYPE_LABELS[editingBlock.type] || editingBlock.type}`
                : "Nuevo Bloque"}
            </Heading>
            <button
              onClick={cancelEditor}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>

          {/* Type selector for new blocks */}
          {creatingType && !editingBlock && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Tipo de Bloque
              </label>
              <Select
                value={creatingType}
                onValueChange={(val) => {
                  setCreatingType(val)
                  setBlockData({})
                }}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {BLOCK_TYPES.map((type) => (
                    <Select.Item key={type} value={type}>
                      {BLOCK_TYPE_LABELS[type]}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          )}

          {/* Dynamic Editor */}
          {EditorComponent && (
            <Suspense
              fallback={
                <div className="py-4 text-gray-400">Cargando editor...</div>
              }
            >
              <EditorComponent data={blockData} onChange={setBlockData} />
            </Suspense>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-ui-border-base">
            <Button
              variant="primary"
              onClick={editingBlock ? handleUpdateBlock : handleCreateBlock}
            >
              {editingBlock ? "Guardar Cambios" : "Crear Bloque"}
            </Button>
            <Button variant="secondary" onClick={cancelEditor}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Detalle de Página",
})

export default ContentPageDetail
