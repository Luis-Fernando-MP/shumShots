import { useQuery, useQueryClient } from '@tanstack/react-query'

import { photosService } from './photos.service'
import type { PhotosTypes } from './photos.type'

export const PHOTOS_PREFIX = 'photos' as const

export const PHOTOS_KEYS = {
  search: [PHOTOS_PREFIX, 'search'] as const
}

const useGetPhotosSearch = (params: PhotosTypes['search']['input']) => {
  return useQuery({
    queryKey: [...PHOTOS_KEYS.search, params.query, params.perPage ?? 10, params.page ?? 1],
    queryFn: () => photosService.search(params),
    enabled: Boolean(params.query.trim()),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60
  })
}

export const useInvalidatePhotosQuery = () => {
  const queryClient = useQueryClient()

  return {
    search: () => queryClient.invalidateQueries({ queryKey: PHOTOS_KEYS.search })
  }
}

export const photosQuery = {
  search: useGetPhotosSearch
}
