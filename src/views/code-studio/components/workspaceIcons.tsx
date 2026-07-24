'use client'

import { getLanguageMetaFromFileName } from '@common/monaco'
import { cn } from '@common/utils/cn'
import { FileCode2 } from 'lucide-react'
import { type FC, useMemo } from 'react'

const MATERIAL_ICONS_BASE = '/api/material-icons'

const FOLDER_ICON_BY_NAME: Record<string, string> = {
  src: 'folder-src',
  source: 'folder-src',
  views: 'folder-views',
  view: 'folder-views',
  components: 'folder-components',
  component: 'folder-components',
  hooks: 'folder-hook',
  hook: 'folder-hook',
  utils: 'folder-utils',
  util: 'folder-utils',
  lib: 'folder-lib',
  libs: 'folder-lib',
  assets: 'folder-images',
  images: 'folder-images',
  public: 'folder-public',
  styles: 'folder-css',
  css: 'folder-css',
  store: 'folder-redux',
  stores: 'folder-redux',
  api: 'folder-api',
  app: 'folder-app',
  apps: 'folder-app',
  config: 'folder-config',
  configs: 'folder-config',
  test: 'folder-test',
  tests: 'folder-test',
  __tests__: 'folder-test',
  docs: 'folder-docs',
  documentation: 'folder-docs',
  workspace: 'folder-project'
}

export const getMaterialFolderIcon = (folderName: string, expanded: boolean) => {
  const key = folderName.toLowerCase()
  const base = FOLDER_ICON_BY_NAME[key] ?? 'folder'
  const icon = expanded ? `${base}-open` : base
  return `${MATERIAL_ICONS_BASE}/${icon}.svg`
}

interface FileTypeIconProps {
  fileName: string
  className?: string
}

export const FileTypeIcon: FC<FileTypeIconProps> = ({ fileName, className }) => {
  const meta = useMemo(() => getLanguageMetaFromFileName(fileName), [fileName])

  if (meta?.Icon) {
    const Icon = meta.Icon
    return (
      <span className={cn('inline-flex size-3.5 shrink-0 items-center justify-center [&_svg]:size-full', className)}>
        <Icon />
      </span>
    )
  }

  return <FileCode2 className={cn('size-3.5 shrink-0 opacity-70', className)} strokeWidth={1.75} />
}

interface FolderTypeIconProps {
  folderName: string
  expanded?: boolean
  className?: string
}

export const FolderTypeIcon: FC<FolderTypeIconProps> = ({ folderName, expanded = false, className }) => (
  <img
    src={getMaterialFolderIcon(folderName, expanded)}
    alt=''
    aria-hidden
    draggable={false}
    className={cn('size-3.5 shrink-0 object-contain', className)}
  />
)
