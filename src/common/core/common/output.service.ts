export interface OutputResponseService<T> {
  data: T
  success?: boolean
  message?: string
  statusCode?: number
  [key: string]: unknown
}
