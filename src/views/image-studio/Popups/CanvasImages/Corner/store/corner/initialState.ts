import type { CornerBorderConfig, CornerRadiusConfig, CornerTabConfig } from './type.corner'

export const STORAGE_KEY = 'pixis:image-studio:corner'
export const STORAGE_VERSION = 1

export const DEFAULT_BORDER: CornerBorderConfig = {
  color: 'rgba(255, 255, 255, 1)',
  size: 5,
  type: 'none',
  finish: 'soft',
  gradient: null,
  blendMode: 'normal',
  matEnabled: false,
  matColor: 'rgba(255, 255, 255, 1)',
  matTop: 0,
  matRight: 0,
  matBottom: 0,
  matLeft: 0
}

export const DEFAULT_RADIUS: CornerRadiusConfig = {
  activeIndividualBorder: false,
  borderLTRadius: 20,
  borderRTRadius: 20,
  borderLBRadius: 20,
  borderRBRadius: 20,
  borderRadius: 20,
  borderSmooth: 0
}

export const createDefaultCornerConfig = (): CornerTabConfig => ({
  border: { ...DEFAULT_BORDER },
  radius: { ...DEFAULT_RADIUS }
})
