import {
  buildAmbientShadow,
  buildContactShadow,
  buildCrispShadow,
  buildDeepShadow,
  buildDriftShadow,
  buildHardShadow,
  buildLiftShadow,
  buildLongShadow,
  buildNoneShadow,
  buildSoftShadow,
  buildStudioShadow
} from './builds'

export const SHADOW_DATA = {
  none: {
    label: 'Limpio',
    blur: 0,
    spread: 0,
    opacity: 0,
    x: 0,
    y: 0,
    preview: 'none',
    pad: { throw: 0, blurGrow: 0, spreadGrow: 0 },
    frameFill: false,
    build: buildNoneShadow
  },
  soft: {
    label: 'Suave',
    blur: 60,
    spread: 0,
    opacity: 0.4,
    x: 0,
    y: 36,
    preview:
      '0 2px 5px rgba(0,0,0,0.22), 0 8px 18px rgba(0,0,0,0.16), 0 20px 36px rgba(0,0,0,0.11), 0 36px 58px rgba(0,0,0,0.07), 0 54px 84px rgba(0,0,0,0.04)',
    pad: { throw: 140, blurGrow: 54, spreadGrow: 0 },
    frameFill: false,
    build: buildSoftShadow
  },
  contact: {
    label: 'Contacto',
    blur: 36,
    spread: 0,
    opacity: 0.48,
    x: 0,
    y: 16,
    preview:
      '0 2px 3px rgba(0,0,0,0.34), 0 5px 10px rgba(0,0,0,0.26), 0 12px 20px rgba(0,0,0,0.16), 0 20px 32px rgba(0,0,0,0.08)',
    pad: { throw: 100, blurGrow: 28, spreadGrow: 2 },
    frameFill: false,
    build: buildContactShadow
  },
  deep: {
    label: 'Profunda',
    blur: 100,
    spread: 6,
    opacity: 0.38,
    x: 20,
    y: 48,
    preview:
      '6px 10px 16px rgba(0,0,0,0.24), 12px 26px 44px rgba(0,0,0,0.17), 18px 48px 78px rgba(0,0,0,0.12), 28px 78px 118px rgba(0,0,0,0.07), 36px 110px 150px rgba(0,0,0,0.04)',
    pad: { throw: 205, blurGrow: 82, spreadGrow: 12 },
    frameFill: true,
    build: buildDeepShadow
  },
  crisp: {
    label: 'Nítida',
    blur: 20,
    spread: 0,
    opacity: 0.5,
    x: 24,
    y: 24,
    preview:
      '10px 10px 3px rgba(0,0,0,0.24), 16px 16px 12px rgba(0,0,0,0.3), 26px 26px 26px rgba(0,0,0,0.16), 38px 38px 44px rgba(0,0,0,0.08)',
    pad: { throw: 96, blurGrow: 16, spreadGrow: 0 },
    frameFill: false,
    build: buildCrispShadow
  },
  ambient: {
    label: 'Ambiente',
    blur: 56,
    spread: 14,
    opacity: 0.4,
    x: 0,
    y: 6,
    preview:
      '0 0 24px 8px rgba(0,0,0,0.18), 0 0 48px 14px rgba(0,0,0,0.13), 0 4px 68px 18px rgba(0,0,0,0.09), 0 12px 90px 22px rgba(0,0,0,0.05)',
    pad: { throw: 64, blurGrow: 20, spreadGrow: 14 },
    frameFill: true,
    build: buildAmbientShadow
  },
  lift: {
    label: 'Flotante',
    blur: 48,
    spread: 2,
    opacity: 0.42,
    x: 0,
    y: 28,
    preview:
      '0 4px 8px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.18), 0 28px 48px rgba(0,0,0,0.12), 0 48px 72px rgba(0,0,0,0.06)',
    pad: { throw: 120, blurGrow: 40, spreadGrow: 4 },
    frameFill: true,
    build: buildLiftShadow
  },
  long: {
    label: 'Larga',
    blur: 72,
    spread: 3,
    opacity: 0.36,
    x: 36,
    y: 52,
    preview:
      '8px 6px 10px rgba(0,0,0,0.22), 22px 18px 28px rgba(0,0,0,0.16), 42px 34px 52px rgba(0,0,0,0.1), 70px 56px 84px rgba(0,0,0,0.06)',
    pad: { throw: 240, blurGrow: 64, spreadGrow: 6 },
    frameFill: true,
    build: buildLongShadow
  },
  hard: {
    label: 'Dura',
    blur: 14,
    spread: 0,
    opacity: 0.52,
    x: 18,
    y: 18,
    preview:
      '8px 8px 2px rgba(0,0,0,0.28), 14px 14px 8px rgba(0,0,0,0.32), 22px 22px 18px rgba(0,0,0,0.16), 30px 30px 32px rgba(0,0,0,0.08)',
    pad: { throw: 88, blurGrow: 10, spreadGrow: 0 },
    frameFill: false,
    build: buildHardShadow
  },
  studio: {
    label: 'Estudio',
    blur: 64,
    spread: 4,
    opacity: 0.4,
    x: 10,
    y: 32,
    preview:
      '2px 4px 8px rgba(0,0,0,0.24), 6px 14px 24px rgba(0,0,0,0.18), 12px 28px 48px rgba(0,0,0,0.12), 20px 48px 76px rgba(0,0,0,0.07)',
    pad: { throw: 150, blurGrow: 50, spreadGrow: 8 },
    frameFill: true,
    build: buildStudioShadow
  },
  drift: {
    label: 'Deriva',
    blur: 70,
    spread: 2,
    opacity: 0.32,
    x: 28,
    y: 40,
    preview:
      '10px 6px 14px rgba(0,0,0,0.16), 24px 16px 32px rgba(0,0,0,0.12), 42px 30px 56px rgba(0,0,0,0.08), 64px 48px 84px rgba(0,0,0,0.04)',
    pad: { throw: 190, blurGrow: 58, spreadGrow: 4 },
    frameFill: false,
    build: buildDriftShadow
  }
} as const

export type ShadowType = keyof typeof SHADOW_DATA

export const SHADOW_PRESETS = (Object.keys(SHADOW_DATA) as ShadowType[]).map(type => {
  const effect = SHADOW_DATA[type]
  return {
    type,
    label: effect.label,
    blur: effect.blur,
    spread: effect.spread,
    opacity: effect.opacity,
    x: effect.x,
    y: effect.y,
    preview: effect.preview
  }
})
