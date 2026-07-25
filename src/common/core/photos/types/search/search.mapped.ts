export type PhotoUrls = {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
}

export type Photo = {
  id: string
  slug: string
  alt: string
  urls: PhotoUrls
  photographer: string
  photographerUsername: string
}

export type SearchMapped = {
  total: number
  totalPages: number
  results: Photo[]
}
