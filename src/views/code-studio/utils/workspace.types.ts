import { exampleShotCode } from '../utils/exampleShotCode'

export type ActivityIconId = 'files' | 'search' | 'git' | 'blocks' | 'settings'

export type FsKind = 'file' | 'folder'

export type FsEntry = {
  id: string
  parentId: string | null
  kind: FsKind
  name: string
  /** Solo archivos */
  content?: string
  expanded?: boolean
}

export const ACTIVITY_ICON_META: Record<
  ActivityIconId,
  { label: string; description: string }
> = {
  files: { label: 'Files', description: 'Explorador' },
  search: { label: 'Search', description: 'Buscar' },
  git: { label: 'Git', description: 'Control de versiones' },
  blocks: { label: 'Extensions', description: 'Extensiones' },
  settings: { label: 'Settings', description: 'Ajustes' }
}

export const DEFAULT_ACTIVITY_ORDER: ActivityIconId[] = [
  'files',
  'search',
  'git',
  'blocks',
  'settings'
]

export const ROOT_ID = 'fs-root'
export const DEFAULT_FILE_ID = 'fs-pixis'

export const createDefaultFilesystem = (): Record<string, FsEntry> => ({
  [ROOT_ID]: {
    id: ROOT_ID,
    parentId: null,
    kind: 'folder',
    name: 'workspace',
    expanded: true
  },
  'fs-src': {
    id: 'fs-src',
    parentId: ROOT_ID,
    kind: 'folder',
    name: 'src',
    expanded: true
  },
  'fs-views': {
    id: 'fs-views',
    parentId: 'fs-src',
    kind: 'folder',
    name: 'views',
    expanded: true
  },
  [DEFAULT_FILE_ID]: {
    id: DEFAULT_FILE_ID,
    parentId: 'fs-views',
    kind: 'file',
    name: 'pixis.ts',
    content: exampleShotCode
  }
})

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

export const getChildren = (entries: Record<string, FsEntry>, parentId: string) =>
  Object.values(entries)
    .filter(entry => entry.parentId === parentId)
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

export const getPathSegments = (entries: Record<string, FsEntry>, fileId: string) => {
  const parts: string[] = []
  let current: FsEntry | undefined = entries[fileId]
  while (current && current.id !== ROOT_ID) {
    parts.unshift(current.name)
    current = current.parentId ? entries[current.parentId] : undefined
  }
  return parts
}

export { languageIdFromFileName as languageFromFileName } from './languageMeta'
