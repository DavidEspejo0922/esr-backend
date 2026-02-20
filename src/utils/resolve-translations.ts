const DEFAULT_LOCALE = "es-CO"

/**
 * Resolve translations for multiple fields on an entity.
 * Falls back to the main field value (es-CO default).
 */
export function resolveEntityTranslations<T extends Record<string, any>>(
  entity: T,
  fields: string[],
  locale: string
): T {
  if (!locale || locale === DEFAULT_LOCALE || !entity.translations) {
    return entity
  }

  // MikroORM may return JSON columns as strings — parse if needed
  const translations = typeof entity.translations === "string"
    ? JSON.parse(entity.translations)
    : entity.translations

  const localeOverrides = translations[locale]
  if (!localeOverrides) return entity

  const resolved: Record<string, any> = { ...entity }
  for (const field of fields) {
    if (localeOverrides[field] !== undefined) {
      resolved[field] = localeOverrides[field]
    }
  }
  return resolved as T
}

/**
 * Apply translation resolution to an array of entities.
 */
export function resolveListTranslations<T extends Record<string, any>>(
  entities: T[],
  fields: string[],
  locale: string
): T[] {
  if (!locale || locale === DEFAULT_LOCALE) return entities
  return entities.map((e) => resolveEntityTranslations(e, fields, locale))
}
