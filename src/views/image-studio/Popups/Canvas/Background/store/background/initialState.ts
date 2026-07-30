import { DEFAULT_BACKGROUND_SIZE } from '@views/image-studio/utils/backgroundStyle'

import type { BackgroundState } from './type.background'

export const STORAGE_KEY = 'image-studio-background'

export const FILTER_DEFAULTS = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  hue: 0,
  filterPreset: 'original' as const
}

export const DUOTONE_DEFAULTS = {
  duotonePreset: 'none' as const,
  duotoneIntensity: 0,
  duotoneShadow: '#1a0533',
  duotoneHighlight: '#1ed760'
}

export const initialState = (): BackgroundState => ({
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
