import { createId } from '@views/image-studio/utils/createId'

import type { SizeLayer } from './type.slot-size'

export const STORAGE_KEY = 'pixis:image-studio:size'
export const STORAGE_VERSION = 1

export const DEFAULT_SLOT_SIZE = { width: 420, height: 315 } as const

export const clampSize = (value: number) => Math.min(4000, Math.max(100, Math.round(value)))

export const createLayer = (id?: string): SizeLayer => ({
  id: id ?? createId('size'),
  targetIds: [],
  width: DEFAULT_SLOT_SIZE.width,
  height: DEFAULT_SLOT_SIZE.height
})
