import type { CSSProperties } from 'react'

import {
  buildAuroraLight,
  buildBeamLight,
  buildBokehLight,
  buildCoolLight,
  buildCurtainLight,
  buildEcoLight,
  buildFlareLight,
  buildFootLight,
  buildHaloLight,
  buildNeonLight,
  buildNoneLight,
  buildPrismaLight,
  buildRaysLight,
  buildSoftLight,
  buildWarmLight
} from './builds'

type Blend = NonNullable<CSSProperties['mixBlendMode']>

export const LIGHT_DATA = {
  none: {
    label: 'Limpio',
    opacity: 0,
    size: 0,
    color: '255,236,180',
    x: 0.5,
    y: 0.35,
    preview: 'none',
    pad: { sizeGrow: 0 },
    blend: 'screen' as Blend,
    build: buildNoneLight
  },
  soft: {
    label: 'Suave',
    opacity: 0.46,
    size: 74,
    color: '255,246,220',
    x: 0.58,
    y: 0.24,
    preview:
      '0 0 10px 2px rgba(255,250,235,0.75), 0 0 22px 6px rgba(255,236,190,0.45), 0 4px 28px 8px rgba(255,230,180,0.25)',
    pad: { sizeGrow: 12 },
    blend: 'screen' as Blend,
    build: buildSoftLight
  },
  beam: {
    label: 'Haz',
    opacity: 0.58,
    size: 52,
    color: '255,248,225',
    x: 0.74,
    y: 0.12,
    preview:
      '0 -8px 10px 1px rgba(255,255,245,0.8), 0 0 16px 3px rgba(255,245,210,0.55), 0 10px 22px 4px rgba(255,230,170,0.3)',
    pad: { sizeGrow: 8, sizeMin: 34 },
    blend: 'screen' as Blend,
    build: buildBeamLight
  },
  warm: {
    label: 'Cálida',
    opacity: 0.52,
    size: 68,
    color: '255,178,96',
    x: 0.68,
    y: 0.38,
    preview:
      '0 0 12px 3px rgba(255,210,140,0.7), 0 2px 20px 5px rgba(255,150,70,0.45), 4px 6px 26px 6px rgba(255,120,50,0.28)',
    pad: { sizeGrow: 14 },
    blend: 'screen' as Blend,
    build: buildWarmLight
  },
  cool: {
    label: 'Fría',
    opacity: 0.48,
    size: 70,
    color: '150,200,255',
    x: 0.32,
    y: 0.28,
    preview:
      '0 0 12px 3px rgba(210,235,255,0.65), 0 0 20px 5px rgba(140,190,255,0.45), -2px 4px 26px 6px rgba(90,150,255,0.28)',
    pad: { sizeGrow: 14 },
    blend: 'screen' as Blend,
    build: buildCoolLight
  },
  flare: {
    label: 'Solar',
    opacity: 0.58,
    size: 78,
    color: '255,244,210',
    x: 0.82,
    y: 0.14,
    preview:
      '0 0 8px 2px rgba(255,255,255,0.9), 0 0 0 4px rgba(255,220,140,0.45), 6px 6px 10px 2px rgba(255,200,120,0.35), 12px 12px 8px 1px rgba(255,180,100,0.25)',
    pad: { sizeGrow: 16 },
    blend: 'screen' as Blend,
    build: buildFlareLight
  },
  curtain: {
    label: 'Telón',
    opacity: 0.54,
    size: 74,
    color: '255,236,200',
    x: 0.5,
    y: 0.12,
    preview:
      '-10px -8px 12px 1px rgba(255,236,200,0.45), 0 -10px 14px 2px rgba(255,236,200,0.7), 10px -8px 12px 1px rgba(255,236,200,0.45)',
    pad: { sizeGrow: 12 },
    blend: 'screen' as Blend,
    build: buildCurtainLight
  },
  foot: {
    label: 'Pie',
    opacity: 0.52,
    size: 74,
    color: '255,220,170',
    x: 0.5,
    y: 0.88,
    preview:
      '-10px 8px 12px 1px rgba(255,220,170,0.45), 0 10px 14px 2px rgba(255,220,170,0.7), 10px 8px 12px 1px rgba(255,220,170,0.45)',
    pad: { sizeGrow: 12 },
    blend: 'screen' as Blend,
    build: buildFootLight
  },
  rays: {
    label: 'Rayos',
    opacity: 0.42,
    size: 84,
    color: '255,236,190',
    x: 0.72,
    y: 0.1,
    preview:
      '0 0 12px 2px rgba(255,236,190,0.45), -8px 10px 18px 0 rgba(255,220,150,0.22), 8px 12px 20px 0 rgba(255,220,150,0.18)',
    pad: { sizeGrow: 16 },
    blend: 'screen' as Blend,
    build: buildRaysLight
  },
  bokeh: {
    label: 'Bokeh',
    opacity: 0.5,
    size: 70,
    color: '255,210,230',
    x: 0.45,
    y: 0.4,
    preview:
      '0 0 8px 3px rgba(255,210,230,0.7), -8px 4px 10px 2px rgba(200,230,255,0.45), 8px -3px 9px 2px rgba(255,230,180,0.4)',
    pad: { sizeGrow: 14 },
    blend: 'screen' as Blend,
    build: buildBokehLight
  },
  aurora: {
    label: 'Aurora',
    opacity: 0.54,
    size: 82,
    color: '140,220,255',
    x: 0.5,
    y: 0.32,
    preview:
      '0 -8px 18px 3px rgba(120,255,200,0.55), 0 0 22px 4px rgba(140,200,255,0.6), 0 8px 18px 3px rgba(220,160,255,0.48)',
    pad: { sizeGrow: 14 },
    blend: 'screen' as Blend,
    build: buildAuroraLight
  },
  neon: {
    label: 'Neón',
    opacity: 0.5,
    size: 72,
    color: '255,80,200',
    x: 0.5,
    y: 0.42,
    preview:
      '0 0 10px 2px rgba(255,140,230,0.65), -10px 0 16px 3px rgba(80,230,255,0.42), 10px 0 16px 3px rgba(255,70,190,0.38)',
    pad: { sizeGrow: 12 },
    blend: 'screen' as Blend,
    build: buildNeonLight
  },
  halo: {
    label: 'Halo',
    opacity: 0.48,
    size: 96,
    color: '255,240,210',
    x: 0.5,
    y: 0.5,
    preview:
      '0 0 0 4px rgba(255,245,220,0.42), 0 0 20px 8px rgba(255,230,180,0.32), 0 0 40px 14px rgba(255,220,160,0.18)',
    pad: { sizeGrow: 12 },
    blend: 'screen' as Blend,
    build: buildHaloLight
  },
  prisma: {
    label: 'Prisma',
    opacity: 0.5,
    size: 76,
    color: '255,255,255',
    x: 0.62,
    y: 0.28,
    preview:
      '-8px 0 12px 2px rgba(255,80,120,0.45), 0 0 14px 3px rgba(120,255,180,0.4), 8px 0 12px 2px rgba(100,160,255,0.45)',
    pad: { sizeGrow: 13 },
    blend: 'screen' as Blend,
    build: buildPrismaLight
  },
  eco: {
    label: 'Eco',
    opacity: 0.46,
    size: 88,
    color: '180,220,255',
    x: 0.5,
    y: 0.48,
    preview:
      '0 0 0 2px rgba(180,220,255,0.4), 0 0 0 8px rgba(160,210,255,0.22), 0 0 18px 12px rgba(140,200,255,0.16)',
    pad: { sizeGrow: 14 },
    blend: 'screen' as Blend,
    build: buildEcoLight
  }
} as const

export type LightType = keyof typeof LIGHT_DATA

export const LIGHT_PRESETS = (Object.keys(LIGHT_DATA) as LightType[]).map(type => {
  const effect = LIGHT_DATA[type]
  return {
    type,
    label: effect.label,
    opacity: effect.opacity,
    size: effect.size,
    color: effect.color,
    x: effect.x,
    y: effect.y,
    preview: effect.preview
  }
})

export const normalizeLightType = (type: string): LightType => {
  if (type === 'rim') return 'soft'
  if (type in LIGHT_DATA) return type as LightType
  return 'none'
}
