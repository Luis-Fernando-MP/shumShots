export type Frame = {
  id: string
  name: string
  label: string
  group: string | null
  path: string
  previewPath: string
  aspect: number | null
}

export type FrameGroup = {
  id: string | null
  label: string
  frames: Frame[]
}

export type ListMapped = {
  frames: Frame[]
  groups: FrameGroup[]
}
