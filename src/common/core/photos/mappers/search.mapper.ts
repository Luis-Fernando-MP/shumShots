import type { Photo, SearchMapped, SearchOutput } from '../types/search'

export const searchMapper = (data: SearchOutput): SearchMapped => ({
  total: data.total,
  totalPages: data.total_pages,
  results: data.results.map(
    (item): Photo => ({
      id: item.id,
      slug: item.slug,
      alt: item.alt_description ?? item.description ?? item.slug,
      urls: item.urls,
      photographer: item.user.name,
      photographerUsername: item.user.username
    })
  )
})
