import {
  type BackgroundPositionPreset,
  POSITION_PRESETS,
  clampPercent,
  normalizeBackgroundValue,
  resolveBackgroundStyle
} from '@views/image-studio/utils/backgroundStyle'
import type { CSSProperties } from 'react'
import { type StateCreator, create } from 'zustand'

interface Props {
  background: string | null
  backgroundWidth: number
  backgroundHeight: number
  blendMode: string
  overlayColor: string
  overlayOpacity: number
  blur: number
  positionPreset: BackgroundPositionPreset
  positionX: number
  positionY: number

  setBackground: (background: string) => void
  setBackgroundWidth: (backgroundWidth: number) => void
  setBackgroundHeight: (backgroundHeight: number) => void
  setBlendMode: (blendMode: string) => void
  setOverlayColor: (overlayColor: string) => void
  setOverlayOpacity: (overlayOpacity: number) => void
  setBlur: (blur: number) => void
  setPositionPreset: (preset: BackgroundPositionPreset) => void
  setPosition: (x: number, y: number) => void

  getBackground: () => CSSProperties
}

const state: StateCreator<Props> = (set, get) => ({
  background: null,
  backgroundWidth: 900,
  backgroundHeight: 600,
  blendMode: 'normal',
  overlayColor: 'rgba(0, 0, 0, 1)',
  overlayOpacity: 5,
  blur: 0,
  positionPreset: 'center',
  positionX: 50,
  positionY: 50,

  setBackgroundWidth: backgroundWidth => set({ backgroundWidth }),
  setBackgroundHeight: backgroundHeight => set({ backgroundHeight }),
  setBackground: background => set({ background: normalizeBackgroundValue(background) }),
  setBlendMode: blendMode => set({ blendMode }),
  setOverlayColor: overlayColor => set({ overlayColor }),
  setOverlayOpacity: overlayOpacity => set({ overlayOpacity }),
  setBlur: blur => set({ blur }),
  setPositionPreset: preset => {
    if (preset === 'free') {
      set({ positionPreset: 'free' })
      return
    }
    const next = POSITION_PRESETS[preset]
    set({ positionPreset: preset, positionX: next.x, positionY: next.y })
  },
  setPosition: (x, y) =>
    set({
      positionPreset: 'free',
      positionX: clampPercent(x),
      positionY: clampPercent(y)
    }),
  getBackground: () => {
    const { background, blendMode, positionX, positionY } = get()
    return resolveBackgroundStyle(background, { blendMode, positionX, positionY })
  }
})

const useBackgroundStore = create(state)

export default useBackgroundStore
