export interface Photos {
  total: number
  total_pages: number
  results: PhotosResult[]
}

export interface PhotosResult {
  id: string
  created_at: string
  slug: string
  width: number
  height: number
  color: string
  blur_hash: string
  likes: number
  liked_by_user: boolean
  description: string
  user: User
  current_user_collections: any[]
  urls: Urls
  links: Links2
}

export interface User {
  id: string
  username: string
  name: string
  first_name: string
  last_name: string
  instagram_username: string
  twitter_username: string
  portfolio_url: string
  profile_image: ProfileImage
  links: Links
}

export interface ProfileImage {
  small: string
  medium: string
  large: string
}

export interface Links {
  self: string
  html: string
  photos: string
  likes: string
}

export interface Urls {
  raw: string
  full: string
  regular: string
  small: string
  thumb: string
}

export interface Links2 {
  self: string
  html: string
  download: string
}
