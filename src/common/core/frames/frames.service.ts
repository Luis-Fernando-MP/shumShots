import { listMapper } from './mappers/list.mapper'
import type { FramesTypes } from './frames.type'

const getFrames = async (): Promise<FramesTypes['list']['mapped']> => {
  const response = await fetch('/api/frames')
  if (!response.ok) throw new Error('Failed to load frames')

  const body = (await response.json()) as FramesTypes['list']['output']
  return {
    ...body,
    data: listMapper(body.data ?? [])
  }
}

export const framesService = {
  list: getFrames
}
