import type { OutputResponseService } from '../common/output.service'
import type { ListInput, ListMapped, ListOutput } from './types/list'

export type WallpapersTypes = {
  list: {
    input: ListInput
    output: OutputResponseService<ListOutput>
    mapped: OutputResponseService<ListMapped>
  }
}

export type { Wallpaper } from './types/list'
