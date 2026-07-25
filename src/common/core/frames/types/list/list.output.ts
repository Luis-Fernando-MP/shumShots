export type FrameOutput = {
  id: string
  name: string
  group: string | null
  path: string
  preview_path: string
  aspect: number | null
}

export type ListOutput = FrameOutput[]
