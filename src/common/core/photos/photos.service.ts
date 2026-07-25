import { searchMapper } from './mappers/search.mapper'
import type { PhotosTypes } from './photos.type'

const getPhotosSearch = async (params: PhotosTypes['search']['input']): Promise<PhotosTypes['search']['mapped']> => {
  const search = new URLSearchParams({
    query: params.query,
    per_page: String(params.perPage ?? 10),
    page: String(params.page ?? 1)
  })

  const response = await fetch(`/api/photos?${search.toString()}`)
  if (!response.ok) throw new Error('Failed to search photos')

  const body = (await response.json()) as PhotosTypes['search']['output']
  if (!body.data) throw new Error(body.message ?? 'Failed to search photos')

  return {
    ...body,
    data: searchMapper(body.data)
  }
}

export const photosService = {
  search: getPhotosSearch
}
