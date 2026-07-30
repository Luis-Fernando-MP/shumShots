import {
  type BackgroundPositionPreset,
  type DuotonePresetId,
  DUOTONE_PRESETS,
  FILTER_PRESETS,
  POSITION_PRESETS,
  VIGNETTE_PRESETS,
  clampPercent,
  clampRange,
  normalizeBackgroundValue,
  resolveBackgroundStyle
} from '@views/image-studio/utils/backgroundStyle'
import { type StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

import { FILTER_DEFAULTS, STORAGE_KEY, STORAGE_VERSION, initialState } from './initialState'
import type BackgroundStore from './type.background'
import type { BackgroundState } from './type.background'

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
  setPositionPreset: (preset: BackgroundPositionPreset) => {
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
  applyDuotonePreset: (id: Exclude<DuotonePresetId, 'custom'>) => {
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
