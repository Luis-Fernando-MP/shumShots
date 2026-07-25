import { useQuery, useQueryClient } from '@tanstack/react-query'

import { wallpapersService } from './wallpapers.service'

export const WALLPAPERS_PREFIX = 'wallpapers' as const

export const WALLPAPERS_KEYS = {
  list: [WALLPAPERS_PREFIX, 'list'] as const
}

const useGetWallpapers = () => {
  return useQuery({
    queryKey: WALLPAPERS_KEYS.list,
    queryFn: () => wallpapersService.list(),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24 * 7
  })
}

export const useInvalidateWallpapersQuery = () => {
  const queryClient = useQueryClient()

  return {
    list: () => queryClient.invalidateQueries({ queryKey: WALLPAPERS_KEYS.list })
  }
}

export const wallpapersQuery = {
  list: useGetWallpapers
}
