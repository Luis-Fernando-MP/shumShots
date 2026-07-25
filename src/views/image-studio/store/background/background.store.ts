import {
  type BackgroundPositionPreset,
  type DuotonePresetId,
  type FilterPresetId,
  type VignettePreset,
  DEFAULT_BACKGROUND_SIZE,
  DUOTONE_PRESETS,
  FILTER_PRESETS,
  POSITION_PRESETS,
  VIGNETTE_PRESETS,
  clampPercent,
  clampRange,
  normalizeBackgroundValue,
  resolveBackgroundStyle
} from '@views/image-studio/utils/backgroundStyle'
import type { CSSProperties } from 'react'
import { type StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BackgroundState {
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

interface BackgroundActions {
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

export type BackgroundStore = BackgroundState & BackgroundActions

const STORAGE_KEY = 'image-studio-background'
const STORAGE_VERSION = 2

const FILTER_DEFAULTS = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hue: 0,
  filterPreset: 'original' as const
}

const DUOTONE_DEFAULTS = {
  duotonePreset: 'none' as const,
  duotoneIntensity: 0,
  duotoneShadow: '#1a0533',
  duotoneHighlight: '#1ed760'
}

const initialState = (): BackgroundState => ({
  background: null,
  backgroundWidth: DEFAULT_BACKGROUND_SIZE.width,
  backgroundHeight: DEFAULT_BACKGROUND_SIZE.height,
  blendMode: 'normal',
  overlayColor: 'rgba(0, 0, 0, 1)',
  overlayOpacity: 5,
  blur: 0,
  rotation: 0,
  positionPreset: 'center',
  positionX: 50,
  positionY: 50,
  scale: 100,
  ...FILTER_DEFAULTS,
  ...DUOTONE_DEFAULTS,
  vignettePreset: 'none',
  vignetteIntensity: 0,
  vignetteSize: 42,
  vignetteSoftness: 55,
  vignetteColor: 'rgba(0, 0, 0, 1)',
  vignetteFocusX: 50,
  vignetteFocusY: 50
})

const markCustomFilter = () => ({ filterPreset: 'custom' as const })

const isPersistableBackground = (value: string | null) => {
  if (!value) return false
  if (value.startsWith('blob:')) return false
  return true
}

const sanitizeBackground = (value: string | null | undefined): string | null => {
  if (!value) return null
  if (!isPersistableBackground(value)) return null
  return normalizeBackgroundValue(value)
}

const mergeBackground = (persisted?: Partial<BackgroundState>): BackgroundState => {
  const defaults = initialState()
  if (!persisted) return defaults

  return {
    ...defaults,
    ...persisted,
    background: sanitizeBackground(persisted.background),
    backgroundWidth: clampRange(persisted.backgroundWidth ?? defaults.backgroundWidth, 100, 4000),
    backgroundHeight: clampRange(persisted.backgroundHeight ?? defaults.backgroundHeight, 100, 4000),
    overlayOpacity: clampPercent(persisted.overlayOpacity ?? defaults.overlayOpacity),
    blur: clampRange(persisted.blur ?? defaults.blur, 0, 40),
    rotation: clampRange(persisted.rotation ?? defaults.rotation, -15, 15),
    positionX: clampPercent(persisted.positionX ?? defaults.positionX),
    positionY: clampPercent(persisted.positionY ?? defaults.positionY),
    scale: clampRange(persisted.scale ?? defaults.scale, 100, 250),
    brightness: clampRange(persisted.brightness ?? defaults.brightness, 0, 200),
    contrast: clampRange(persisted.contrast ?? defaults.contrast, 0, 200),
    saturate: clampRange(persisted.saturate ?? defaults.saturate, 0, 200),
    grayscale: clampPercent(persisted.grayscale ?? defaults.grayscale),
    sepia: clampPercent(persisted.sepia ?? defaults.sepia),
    hue: clampRange(persisted.hue ?? defaults.hue, 0, 360),
    duotoneIntensity: clampPercent(persisted.duotoneIntensity ?? defaults.duotoneIntensity),
    vignetteIntensity: clampPercent(persisted.vignetteIntensity ?? defaults.vignetteIntensity),
    vignetteSize: clampPercent(persisted.vignetteSize ?? defaults.vignetteSize),
    vignetteSoftness: clampPercent(persisted.vignetteSoftness ?? defaults.vignetteSoftness),
    vignetteFocusX: clampPercent(persisted.vignetteFocusX ?? defaults.vignetteFocusX),
    vignetteFocusY: clampPercent(persisted.vignetteFocusY ?? defaults.vignetteFocusY)
  }
}

const state: StateCreator<BackgroundStore> = (set, get) => ({
  ...initialState(),

  setBackgroundWidth: backgroundWidth => set({ backgroundWidth }),
  setBackgroundHeight: backgroundHeight => set({ backgroundHeight }),
  setBackgroundSize: (width, height) =>
    set({
      backgroundWidth: clampRange(width, 100, 4000),
      backgroundHeight: clampRange(height, 100, 4000)
    }),
  setBackground: background => set({ background: normalizeBackgroundValue(background) }),
  setBlendMode: blendMode => set({ blendMode }),
  setOverlayColor: overlayColor => set({ overlayColor }),
  setOverlayOpacity: overlayOpacity => set({ overlayOpacity: clampPercent(overlayOpacity) }),
  setBlur: blur => set({ blur: clampRange(blur, 0, 40) }),
  setRotation: rotation => set({ rotation: clampRange(rotation, -15, 15) }),
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
  setScale: scale => set({ scale: clampRange(scale, 100, 250) }),
  setBrightness: brightness => set({ brightness: clampRange(brightness, 0, 200), ...markCustomFilter() }),
  setContrast: contrast => set({ contrast: clampRange(contrast, 0, 200), ...markCustomFilter() }),
  setSaturate: saturate => set({ saturate: clampRange(saturate, 0, 200), ...markCustomFilter() }),
  setGrayscale: grayscale => set({ grayscale: clampRange(grayscale, 0, 100), ...markCustomFilter() }),
  setSepia: sepia => set({ sepia: clampRange(sepia, 0, 100), ...markCustomFilter() }),
  setHue: hue => set({ hue: clampRange(hue, 0, 360), ...markCustomFilter() }),
  applyFilterPreset: id => {
    const preset = FILTER_PRESETS.find(item => item.id === id)
    if (!preset) return
    set({ filterPreset: id, ...preset.values })
  },
  setDuotonePreset: duotonePreset => set({ duotonePreset }),
  setDuotoneIntensity: duotoneIntensity =>
    set({
      duotoneIntensity: clampPercent(duotoneIntensity),
      duotonePreset: 'custom'
    }),
  setDuotoneShadow: duotoneShadow => set({ duotoneShadow, duotonePreset: 'custom' }),
  setDuotoneHighlight: duotoneHighlight => set({ duotoneHighlight, duotonePreset: 'custom' }),
  applyDuotonePreset: id => {
    const found = DUOTONE_PRESETS.find(item => item.id === id)
    if (!found) return
    set({
      duotonePreset: id,
      duotoneShadow: found.shadow,
      duotoneHighlight: found.highlight,
      duotoneIntensity: found.intensity
    })
  },
  setVignettePreset: vignettePreset => set({ vignettePreset }),
  setVignetteIntensity: vignetteIntensity => set({ vignetteIntensity: clampPercent(vignetteIntensity) }),
  setVignetteSize: vignetteSize => set({ vignetteSize: clampPercent(vignetteSize) }),
  setVignetteSoftness: vignetteSoftness => set({ vignetteSoftness: clampPercent(vignetteSoftness) }),
  setVignetteColor: vignetteColor => set({ vignetteColor }),
  setVignetteFocus: (x, y) =>
    set({
      vignetteFocusX: clampPercent(x),
      vignetteFocusY: clampPercent(y)
    }),
  applyVignettePreset: preset => {
    const found = VIGNETTE_PRESETS.find(item => item.id === preset)
    if (!found) return
    set({
      vignettePreset: preset,
      vignetteIntensity: found.values.intensity,
      vignetteSize: found.values.size,
      vignetteSoftness: found.values.softness,
      vignetteColor: found.values.color,
      vignetteFocusX: found.values.focusX,
      vignetteFocusY: found.values.focusY
    })
  },
  resetFilters: () => set({ ...FILTER_DEFAULTS }),
  resetBackground: () => set(initialState()),
  getBackground: () => {
    const { background, blendMode, positionX, positionY, scale } = get()
    return resolveBackgroundStyle(background, { blendMode, positionX, positionY, scale })
  }
})

const useBackgroundStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    partialize: (s): BackgroundState => ({
      background: isPersistableBackground(s.background) ? s.background : null,
      backgroundWidth: s.backgroundWidth,
      backgroundHeight: s.backgroundHeight,
      blendMode: s.blendMode,
      overlayColor: s.overlayColor,
      overlayOpacity: s.overlayOpacity,
      blur: s.blur,
      rotation: s.rotation,
      positionPreset: s.positionPreset,
      positionX: s.positionX,
      positionY: s.positionY,
      scale: s.scale,
      brightness: s.brightness,
      contrast: s.contrast,
      saturate: s.saturate,
      grayscale: s.grayscale,
      sepia: s.sepia,
      hue: s.hue,
      filterPreset: s.filterPreset,
      duotonePreset: s.duotonePreset,
      duotoneIntensity: s.duotoneIntensity,
      duotoneShadow: s.duotoneShadow,
      duotoneHighlight: s.duotoneHighlight,
      vignettePreset: s.vignettePreset,
      vignetteIntensity: s.vignetteIntensity,
      vignetteSize: s.vignetteSize,
      vignetteSoftness: s.vignetteSoftness,
      vignetteColor: s.vignetteColor,
      vignetteFocusX: s.vignetteFocusX,
      vignetteFocusY: s.vignetteFocusY
    }),
    merge: (persisted, current) => ({
      ...current,
      ...mergeBackground(persisted as Partial<BackgroundState> | undefined)
    })
  })
)

export default useBackgroundStore
