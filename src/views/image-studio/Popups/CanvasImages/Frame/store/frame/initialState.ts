import type { FrameTabConfig, SlotPan } from './type.frame'

export const STORAGE_KEY = 'pixis:image-studio:frame-config'

export const DEFAULT_PAN: SlotPan = { x: 0.5, y: 0.5 }

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export const createDefaultFrameConfig = (): FrameTabConfig => ({
  frameId: null,
  frameAspect: null,
  fitMode: 'cover'
})

export const defaultSlotPan = DEFAULT_PAN
