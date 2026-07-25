export type SearchInput = {
  query: string
  perPage?: number
  page?: number
}

export type PhotoUrlsOutput = {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
}

export type PhotoUserOutput = {
  name: string
  username: string
}

export type PhotoOutput = {
  id: string
  slug: string
  description: string | null
  alt_description: string | null
  urls: PhotoUrlsOutput
  user: PhotoUserOutput
}

export type SearchOutput = {
  total: number
  total_pages: number
  results: PhotoOutput[]
}
