import type { Frame, FrameGroup, ListMapped, ListOutput } from '../types/list'

const toTitle = (value: string) =>
  value
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const stripCloudinarySuffix = (value: string) => value.replace(/_[a-z0-9]{5,}$/i, '')

const toLabel = (fileName: string) => toTitle(stripCloudinarySuffix(fileName.replace(/\.[^.]+$/, '')))

const toGroupLabel = (group: string | null) => {
  if (!group) return 'Sin grupo'
  return group.split('/').filter(Boolean).map(toTitle).join(' / ')
}

export const listMapper = (data: ListOutput): ListMapped => {
  const frames: Frame[] = data.map(item => ({
    id: item.id,
    name: item.name,
    label: toLabel(item.name),
    group: item.group,
    path: item.path,
    previewPath: item.preview_path || item.path,
    aspect: item.aspect
  }))

  const byGroup = new Map<string | null, Frame[]>()
  for (const frame of frames) {
    const list = byGroup.get(frame.group) ?? []
    list.push(frame)
    byGroup.set(frame.group, list)
  }

  const groups: FrameGroup[] = [...byGroup.entries()]
    .sort(([a], [b]) => {
      if (a === null) return 1
      if (b === null) return -1
      return a.localeCompare(b, undefined, { sensitivity: 'base' })
    })
    .map(([id, groupFrames]) => ({
      id,
      label: toGroupLabel(id),
      frames: groupFrames
    }))

  return { frames, groups }
}
