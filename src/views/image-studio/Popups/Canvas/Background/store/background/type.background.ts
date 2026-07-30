import type {
  BackgroundPositionPreset,
  DuotonePresetId,
  FilterPresetId,
  VignettePreset
} from '@views/image-studio/utils/backgroundStyle'
import type { CSSProperties } from 'react'

export interface BackgroundState {
  background: string | null
  backgroundWidth: number
  backgroundHeight: number
  blendMode: string
  overlayColor: string
  overlayOpacity: number
  blur: number
  rotation: number
  positionPreset: BackgroundPositionPreset
  positionX: number
  positionY: number
  scale: number
  brightness: number
  contrast: number
  saturate: number
  grayscale: number
  sepia: number
  hue: number
  filterPreset: FilterPresetId | 'custom'
  duotonePreset: DuotonePresetId
  duotoneIntensity: number
  duotoneShadow: string
  duotoneHighlight: string
  vignettePreset: VignettePreset
  vignetteIntensity: number
  vignetteSize: number
  vignetteSoftness: number
  vignetteColor: string
  vignetteFocusX: number
  vignetteFocusY: number
}

export interface BackgroundActions {
  setBackground: (background: string) => void
  setBackgroundWidth: (backgroundWidth: number) => void
  setBackgroundHeight: (backgroundHeight: number) => void
  setBackgroundSize: (width: number, height: number) => void
  setBlendMode: (blendMode: string) => void
  setOverlayColor: (overlayColor: string) => void
  setOverlayOpacity: (overlayOpacity: number) => void
  setBlur: (blur: number) => void
  setRotation: (rotation: number) => void
  setPositionPreset: (preset: BackgroundPositionPreset) => void
  setPosition: (x: number, y: number) => void
  setScale: (scale: number) => void
  setBrightness: (brightness: number) => void
  setContrast: (contrast: number) => void
  setSaturate: (saturate: number) => void
  setGrayscale: (grayscale: number) => void
  setSepia: (sepia: number) => void
  setHue: (hue: number) => void
  applyFilterPreset: (id: FilterPresetId) => void
  setDuotonePreset: (preset: DuotonePresetId) => void
  setDuotoneIntensity: (intensity: number) => void
  setDuotoneShadow: (color: string) => void
  setDuotoneHighlight: (color: string) => void
  applyDuotonePreset: (id: Exclude<DuotonePresetId, 'custom'>) => void
  setVignettePreset: (preset: VignettePreset) => void
  setVignetteIntensity: (vignetteIntensity: number) => void
  setVignetteSize: (vignetteSize: number) => void
  setVignetteSoftness: (vignetteSoftness: number) => void
  setVignetteColor: (vignetteColor: string) => void
  setVignetteFocus: (x: number, y: number) => void
  applyVignettePreset: (preset: Exclude<VignettePreset, 'none' | 'custom'>) => void
  resetFilters: () => void
  resetBackground: () => void
  getBackground: () => CSSProperties
}

type BackgroundStore = BackgroundState & BackgroundActions

export default BackgroundStore
