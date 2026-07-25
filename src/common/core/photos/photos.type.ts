import type { OutputResponseService } from '../common/output.service'
import type { SearchInput, SearchMapped, SearchOutput } from './types/search'

export type PhotosTypes = {
  search: {
    input: SearchInput
    output: OutputResponseService<SearchOutput>
    mapped: OutputResponseService<SearchMapped>
  }
}

export type { Photo, SearchMapped } from './types/search'
