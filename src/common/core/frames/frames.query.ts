import { useQuery, useQueryClient } from '@tanstack/react-query'

import { framesService } from './frames.service'

export const FRAMES_PREFIX = 'frames' as const

export const FRAMES_KEYS = {
  list: [FRAMES_PREFIX, 'list'] as const
}

const useGetFrames = () =>
  useQuery({
    queryKey: FRAMES_KEYS.list,
    queryFn: () => framesService.list(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30
  })

export const useInvalidateFramesQuery = () => {
  const queryClient = useQueryClient()
  return {
    list: () => queryClient.invalidateQueries({ queryKey: FRAMES_KEYS.list })
  }
}

export const framesQuery = {
  list: useGetFrames
}
