import { listMapper } from './mappers/list.mapper'
import type { WallpapersTypes } from './wallpapers.type'

const getWallpapers = async (): Promise<WallpapersTypes['list']['mapped']> => {
  const response = await fetch('/api/wallpapers')
  if (!response.ok) throw new Error('Failed to load wallpapers')

  const body = (await response.json()) as WallpapersTypes['list']['output']
  return {
    ...body,
    data: listMapper(body.data ?? [])
  }
}

export const wallpapersService = {
  list: getWallpapers
}
