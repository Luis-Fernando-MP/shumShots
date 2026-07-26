export type ShadowType = 'none' | 'soft' | 'contact' | 'deep' | 'crisp' | 'ambient'
export type LightType = 'none' | 'soft' | 'beam' | 'rim' | 'warm' | 'cool'

export type ShadowPosition = { x: number; y: number }
export type LightFocus = { x: number; y: number }

export type ShadowPreset = {
  type: ShadowType
  label: string
  blur: number
  spread: number
  opacity: number
  x: number
  y: number
  preview: string
}

export type LightPreset = {
  type: LightType
  label: string
  opacity: number
  size: number
  color: string
  x: number
  y: number
  preview: string
}

export type ShadowLayer = {
  id: string
  label: string
  type: ShadowType
  opacity: number
  blur: number
  spread: number
  color: string
  position: ShadowPosition
  targetIds: string[]
}

export type LightLayer = {
  id: string
  label: string
  type: LightType
  opacity: number
  size: number
  color: string
  focus: LightFocus
  targetIds: string[]
}

export const SHADOW_PRESETS: readonly ShadowPreset[] = [
  { type: 'none', label: 'Limpio', blur: 0, spread: 0, opacity: 0, x: 0, y: 0, preview: 'none' },
  {
    type: 'soft',
    label: 'Suave',
    blur: 52,
    spread: 0,
    opacity: 0.38,
    x: 0,
    y: 32,
    preview:
      '0 2px 4px rgba(0,0,0,0.2), 0 6px 14px rgba(0,0,0,0.16), 0 14px 28px rgba(0,0,0,0.12), 0 28px 48px rgba(0,0,0,0.09), 0 44px 72px rgba(0,0,0,0.06)'
  },
  {
    type: 'contact',
    label: 'Contacto',
    blur: 42,
    spread: 0,
    opacity: 0.42,
    x: 0,
    y: 22,
    preview: '0 3px 6px rgba(0,0,0,0.28), 0 8px 16px rgba(0,0,0,0.2), 0 18px 32px rgba(0,0,0,0.14), 0 32px 48px rgba(0,0,0,0.08)'
  },
  {
    type: 'deep',
    label: 'Profunda',
    blur: 88,
    spread: 4,
    opacity: 0.36,
    x: 16,
    y: 40,
    preview:
      '4px 6px 12px rgba(0,0,0,0.22), 8px 18px 36px rgba(0,0,0,0.16), 14px 36px 64px rgba(0,0,0,0.12), 22px 60px 96px rgba(0,0,0,0.08), 30px 88px 128px rgba(0,0,0,0.05)'
  },
  {
    type: 'crisp',
    label: 'Nítida',
    blur: 28,
    spread: 0,
    opacity: 0.44,
    x: 20,
    y: 20,
    preview:
      '8px 8px 6px rgba(0,0,0,0.2), 14px 14px 18px rgba(0,0,0,0.26), 24px 24px 36px rgba(0,0,0,0.14), 36px 36px 56px rgba(0,0,0,0.08)'
  },
  {
    type: 'ambient',
    label: 'Ambiente',
    blur: 50,
    spread: 10,
    opacity: 0.4,
    x: 0,
    y: 10,
    preview:
      '0 0 20px 4px rgba(0,0,0,0.2), 0 0 40px 10px rgba(0,0,0,0.16), 0 6px 56px 14px rgba(0,0,0,0.12), 0 14px 72px 18px rgba(0,0,0,0.08)'
  }
]

export const LIGHT_PRESETS: readonly LightPreset[] = [
  { type: 'none', label: 'Limpio', opacity: 0, size: 0, color: '255,236,180', x: 0.5, y: 0.35, preview: 'none' },
  {
    type: 'soft',
    label: 'Suave',
    opacity: 0.42,
    size: 70,
    color: '255,244,214',
    x: 0.55,
    y: 0.28,
    preview: '0 0 18px 4px rgba(255,236,180,0.55)'
  },
  {
    type: 'beam',
    label: 'Haz',
    opacity: 0.55,
    size: 48,
    color: '255,250,230',
    x: 0.72,
    y: 0.18,
    preview: '0 0 14px 2px rgba(255,250,220,0.7)'
  },
  {
    type: 'rim',
    label: 'Contorno',
    opacity: 0.5,
    size: 85,
    color: '200,220,255',
    x: 0.2,
    y: 0.35,
    preview: '0 0 16px 3px rgba(180,210,255,0.55)'
  },
  {
    type: 'warm',
    label: 'Cálida',
    opacity: 0.48,
    size: 62,
    color: '255,186,120',
    x: 0.65,
    y: 0.4,
    preview: '0 0 18px 4px rgba(255,186,120,0.6)'
  },
  {
    type: 'cool',
    label: 'Fría',
    opacity: 0.44,
    size: 66,
    color: '170,210,255',
    x: 0.35,
    y: 0.3,
    preview: '0 0 18px 4px rgba(170,210,255,0.55)'
  }
]
