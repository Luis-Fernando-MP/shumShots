import { parseRgb, rgbMix } from '@views/image-studio/Popups/common/lib/fx-shared/color'
import { clamp } from '@views/image-studio/Popups/common/lib/fx-shared/math'
import type { LightBuildInput } from './types'

// --- stageBattery ---
const buildStageBatteryBackground = (
  direction: 'down' | 'up',
  focusX: number,
  focusY: number,
  lightSize: number,
  lightColor: string,
  lightOpacity: number
) => {
  const beamAlpha = Math.min(0.62, lightOpacity * 0.85)
  const tipAlpha = Math.min(0.85, lightOpacity + 0.08)
  const washAlpha = Math.min(0.22, lightOpacity * 0.28)
  const beamW = clamp(lightSize * 0.22, 10, 22)
  const reachBias = direction === 'down' ? focusY : 100 - focusY
  const beamH = clamp(lightSize * 0.75 + reachBias * 0.35, 42, 92)
  const anchorY = direction === 'down' ? -4 : 104
  const shift = (focusX - 50) * 0.55
  const slots = [-38, -19, 0, 19, 38]
  const weights = [0.72, 0.88, 1, 0.88, 0.72]

  const spots = slots.map((offset, index) => {
    const px = clamp(50 + shift + offset, 4, 96)
    const w = beamW * (0.85 + weights[index] * 0.2)
    const h = beamH * weights[index]
    const a = beamAlpha * weights[index]
    return `radial-gradient(${w.toFixed(1)}% ${h.toFixed(1)}% at ${px.toFixed(1)}% ${anchorY}%, rgba(${lightColor}, ${tipAlpha.toFixed(2)}) 0%, rgba(${lightColor}, ${a.toFixed(2)}) 18%, rgba(${lightColor}, ${(a * 0.35).toFixed(2)}) 48%, transparent 72%)`
  })

  const wash =
    direction === 'down'
      ? `linear-gradient(to bottom, rgba(${lightColor}, ${washAlpha.toFixed(2)}) 0%, transparent ${clamp(beamH * 0.75, 35, 70).toFixed(0)}%)`
      : `linear-gradient(to top, rgba(${lightColor}, ${washAlpha.toFixed(2)}) 0%, transparent ${clamp(beamH * 0.75, 35, 70).toFixed(0)}%)`

  return [...spots, wash].join(', ')
}


// --- none ---
export const buildNoneLight = (_input: LightBuildInput): string | undefined => undefined


// --- soft ---
export const buildSoftLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.78, opacity + 0.12)
  const mid = Math.min(0.42, opacity * 0.55)
  const fill = Math.min(0.2, opacity * 0.28)
  const coreR = Math.max(8, size * 0.14)
  const glowR = Math.max(coreR + 14, size * 0.55)
  const wrapR = Math.max(glowR + 10, size * 0.95)
  const fillX = clamp(50 + (50 - x) * 0.18, 8, 92)
  const fillY = clamp(50 + (50 - y) * 0.12, 12, 88)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${Math.min(0.95, tip + 0.12).toFixed(2)}) 0%, rgba(${color}, ${tip.toFixed(2)}) ${Math.max(3, coreR * 0.35).toFixed(1)}%, rgba(${color}, ${(tip * 0.35).toFixed(2)}) ${coreR.toFixed(1)}%, transparent ${(coreR * 1.8).toFixed(1)}%)`,
    `radial-gradient(ellipse 85% 70% at ${x}% ${y}%, rgba(${color}, ${mid.toFixed(2)}) 0%, rgba(${color}, ${(mid * 0.4).toFixed(2)}) ${glowR.toFixed(1)}%, transparent ${wrapR.toFixed(1)}%)`,
    `radial-gradient(ellipse 110% 90% at ${fillX.toFixed(1)}% ${fillY.toFixed(1)}%, rgba(${color}, ${fill.toFixed(2)}) 0%, transparent ${Math.max(45, size * 0.85).toFixed(1)}%)`
  ].join(', ')
}


// --- beam ---
export const buildBeamLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.92, opacity + 0.18)
  const shaft = Math.min(0.55, opacity * 0.75)
  const spill = Math.min(0.22, opacity * 0.3)
  const angle = Math.atan2(50 - y, 50 - x) * (180 / Math.PI) + 90
  const throwLen = clamp(size * 1.15 + Math.hypot(50 - x, 50 - y) * 0.35, 55, 120)
  const throwW = clamp(size * 0.28, 12, 28)
  const tipR = Math.max(3.5, size * 0.08)
  const midX = clamp(x + (50 - x) * 0.45, 4, 96)
  const midY = clamp(y + (50 - y) * 0.45, 4, 96)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${Math.min(1, tip + 0.08).toFixed(2)}) 0%, rgba(${color}, ${tip.toFixed(2)}) ${tipR.toFixed(1)}%, rgba(${color}, ${(tip * 0.35).toFixed(2)}) ${(tipR * 2.2).toFixed(1)}%, transparent ${(tipR * 3.6).toFixed(1)}%)`,
    `radial-gradient(${throwW.toFixed(1)}% ${throwLen.toFixed(1)}% at ${x}% ${y}%, rgba(${color}, ${shaft.toFixed(2)}) 0%, rgba(${color}, ${(shaft * 0.45).toFixed(2)}) 32%, rgba(${color}, ${(shaft * 0.15).toFixed(2)}) 58%, transparent 78%)`,
    `radial-gradient(ellipse 70% 55% at ${midX.toFixed(1)}% ${midY.toFixed(1)}%, rgba(${color}, ${(shaft * 0.35).toFixed(2)}) 0%, transparent ${Math.max(28, size * 0.5).toFixed(1)}%)`,
    `conic-gradient(from ${angle.toFixed(1)}deg at ${x}% ${y}%, transparent 0deg, rgba(${color}, ${spill.toFixed(2)}) 8deg, rgba(${color}, ${(spill * 0.35).toFixed(2)}) 16deg, transparent 28deg, transparent 360deg)`
  ].join(', ')
}


// --- warm ---
export const buildWarmLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const base = parseRgb(color)
  const peach = rgbMix(base, { r: 255, g: 200, b: 140 }, 0.55)
  const amber = rgbMix(base, { r: 255, g: 150, b: 70 }, 0.5)
  const ember = rgbMix(base, { r: 255, g: 110, b: 40 }, 0.45)
  const tip = Math.min(0.85, opacity + 0.12)
  const mid = Math.min(0.48, opacity * 0.65)
  const wash = Math.min(0.24, opacity * 0.35)
  const coreR = Math.max(7, size * 0.12)
  const glowR = Math.max(coreR + 16, size * 0.58)
  const washR = Math.max(glowR + 12, size * 1.05)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,250,230, ${Math.min(0.95, tip + 0.1).toFixed(2)}) 0%, rgba(${peach}, ${tip.toFixed(2)}) ${Math.max(3, coreR * 0.4).toFixed(1)}%, rgba(${amber}, ${(tip * 0.4).toFixed(2)}) ${coreR.toFixed(1)}%, transparent ${(coreR * 1.9).toFixed(1)}%)`,
    `radial-gradient(ellipse 95% 80% at ${x}% ${y}%, rgba(${amber}, ${mid.toFixed(2)}) 0%, rgba(${ember}, ${(mid * 0.45).toFixed(2)}) ${glowR.toFixed(1)}%, transparent ${washR.toFixed(1)}%)`,
    `radial-gradient(ellipse 120% 70% at ${(x * 0.7 + 30).toFixed(1)}% ${(y + 18).toFixed(1)}%, rgba(${ember}, ${wash.toFixed(2)}) 0%, transparent ${Math.max(40, size * 0.8).toFixed(1)}%)`,
    `linear-gradient(160deg, rgba(${peach}, ${(wash * 0.55).toFixed(2)}) 0%, transparent 42%, rgba(${ember}, ${(wash * 0.4).toFixed(2)}) 100%)`
  ].join(', ')
}


// --- cool ---
export const buildCoolLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const base = parseRgb(color)
  const ice = rgbMix(base, { r: 220, g: 240, b: 255 }, 0.55)
  const azure = rgbMix(base, { r: 130, g: 185, b: 255 }, 0.5)
  const deep = rgbMix(base, { r: 70, g: 130, b: 255 }, 0.45)
  const tip = Math.min(0.82, opacity + 0.1)
  const mid = Math.min(0.44, opacity * 0.6)
  const wash = Math.min(0.22, opacity * 0.32)
  const coreR = Math.max(7, size * 0.12)
  const glowR = Math.max(coreR + 16, size * 0.56)
  const washR = Math.max(glowR + 12, size * 1.02)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${Math.min(0.92, tip + 0.12).toFixed(2)}) 0%, rgba(${ice}, ${tip.toFixed(2)}) ${Math.max(3, coreR * 0.4).toFixed(1)}%, rgba(${azure}, ${(tip * 0.38).toFixed(2)}) ${coreR.toFixed(1)}%, transparent ${(coreR * 1.9).toFixed(1)}%)`,
    `radial-gradient(ellipse 90% 85% at ${x}% ${y}%, rgba(${azure}, ${mid.toFixed(2)}) 0%, rgba(${deep}, ${(mid * 0.42).toFixed(2)}) ${glowR.toFixed(1)}%, transparent ${washR.toFixed(1)}%)`,
    `radial-gradient(ellipse 70% 110% at ${(x * 0.55 + 10).toFixed(1)}% ${(y - 8).toFixed(1)}%, rgba(${ice}, ${(wash * 0.85).toFixed(2)}) 0%, transparent ${Math.max(36, size * 0.7).toFixed(1)}%)`,
    `linear-gradient(200deg, rgba(${deep}, ${(wash * 0.5).toFixed(2)}) 0%, transparent 48%, rgba(${ice}, ${(wash * 0.35).toFixed(2)}) 100%)`
  ].join(', ')
}


// --- flare ---
export const buildFlareLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const core = Math.min(0.95, opacity + 0.15)
  const glow = Math.min(0.45, opacity * 0.55)
  const ring = Math.min(0.5, opacity * 0.7)
  const streak = Math.min(0.35, opacity * 0.4)
  const coreR = Math.max(4, size * 0.07)
  const glowR = Math.max(coreR + 10, size * 0.55)
  const ringInner = Math.max(coreR + 3, size * 0.14)
  const ringOuter = ringInner + Math.max(2, size * 0.035)
  const streakW = Math.max(55, size * 1.1)
  const streakH = Math.max(4, size * 0.06)
  const ox = 100 - x
  const oy = 100 - y
  const orbTs = [0.22, 0.38, 0.55, 0.72, 0.88] as const
  const orbScales = [0.11, 0.08, 0.14, 0.07, 0.1] as const
  const orbAlphas = [0.55, 0.4, 0.5, 0.32, 0.38] as const

  const orbs = orbTs.map((t, index) => {
    const px = x + (ox - x) * t
    const py = y + (oy - y) * t
    const radius = Math.max(2.5, size * orbScales[index])
    const alpha = Math.min(0.75, opacity * orbAlphas[index])
    return `radial-gradient(circle at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(${color}, ${alpha.toFixed(2)}) 0%, rgba(${color}, ${(alpha * 0.35).toFixed(2)}) ${radius.toFixed(1)}%, transparent ${(radius * 2.2).toFixed(1)}%)`
  })

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${Math.min(1, core + 0.1).toFixed(2)}) 0%, rgba(${color}, ${core.toFixed(2)}) ${coreR.toFixed(1)}%, rgba(${color}, ${(core * 0.25).toFixed(2)}) ${(coreR * 2).toFixed(1)}%, transparent ${(coreR * 3.2).toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, rgba(${color}, ${glow.toFixed(2)}) 0%, transparent ${glowR.toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, transparent ${(ringInner - 1).toFixed(1)}%, rgba(${color}, ${ring.toFixed(2)}) ${ringInner.toFixed(1)}%, rgba(${color}, ${(ring * 0.5).toFixed(2)}) ${((ringInner + ringOuter) / 2).toFixed(1)}%, transparent ${ringOuter.toFixed(1)}%)`,
    `radial-gradient(${streakW.toFixed(0)}% ${streakH.toFixed(0)}% at ${x}% ${y}%, rgba(${color}, ${streak.toFixed(2)}) 0%, rgba(${color}, ${(streak * 0.35).toFixed(2)}) 35%, transparent 70%)`,
    ...orbs
  ].join(', ')
}


// --- curtain ---
export const buildCurtainLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  return buildStageBatteryBackground('down', focus.x * 100, focus.y * 100, size, color, opacity)
}


// --- foot ---
export const buildFootLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  return buildStageBatteryBackground('up', focus.x * 100, focus.y * 100, size, color, opacity)
}


// --- rays ---
export const buildRaysLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.55, opacity * 0.7 + 0.08)
  const ray = Math.min(0.28, opacity * 0.38)
  const haze = Math.min(0.18, opacity * 0.24)
  const glowR = Math.max(16, size * 0.42)
  const spread = clamp(size * 1.05, 48, 110)
  const fanSpan = clamp(86 + size * 0.28, 78, 130)
  const rayCount = 8
  const towardCenter = Math.atan2(50 - y, 50 - x) * (180 / Math.PI) + 90
  const fromAngle = towardCenter - fanSpan / 2

  const stops: string[] = ['transparent 0deg']
  for (let i = 0; i < rayCount; i += 1) {
    const center = ((i + 0.5) / rayCount) * fanSpan
    const half = 1.8 + (i % 3) * 0.85 + size * 0.01
    const a0 = Math.max(0, center - half)
    const a1 = center
    const a2 = Math.min(fanSpan, center + half)
    const alpha = ray * (0.42 + (i % 3) * 0.12)
    stops.push(`transparent ${a0.toFixed(1)}deg`)
    stops.push(`rgba(${color}, ${(alpha * 0.35).toFixed(2)}) ${a0.toFixed(1)}deg`)
    stops.push(`rgba(${color}, ${alpha.toFixed(2)}) ${a1.toFixed(1)}deg`)
    stops.push(`rgba(${color}, ${(alpha * 0.3).toFixed(2)}) ${a2.toFixed(1)}deg`)
    stops.push(`transparent ${(a2 + half * 0.4).toFixed(1)}deg`)
  }
  stops.push(`transparent ${fanSpan.toFixed(1)}deg`)
  stops.push('transparent 360deg')

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${tip.toFixed(2)}) 0%, rgba(${color}, ${(tip * 0.55).toFixed(2)}) ${Math.max(4, size * 0.06).toFixed(1)}%, rgba(${color}, ${haze.toFixed(2)}) ${glowR.toFixed(1)}%, transparent ${spread.toFixed(1)}%)`,
    `conic-gradient(from ${fromAngle.toFixed(1)}deg at ${x}% ${y}%, ${stops.join(', ')})`
  ].join(', ')
}


// --- bokeh ---
export const buildBokehLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const base = parseRgb(color)
  const tintA = rgbMix(base, { r: 255, g: 210, b: 230 }, 0.45)
  const tintB = rgbMix(base, { r: 180, g: 230, b: 255 }, 0.5)
  const tintC = rgbMix(base, { r: 255, g: 230, b: 170 }, 0.4)
  const tints = [color, tintA, tintB, tintC, tintA, tintB, color, tintC, tintA, tintB]

  const seeds = [
    [0.08, -0.18, 0.16],
    [-0.22, 0.12, 0.11],
    [0.28, 0.2, 0.14],
    [-0.1, 0.32, 0.09],
    [0.34, -0.08, 0.12],
    [-0.32, -0.14, 0.1],
    [0.16, 0.38, 0.13],
    [-0.26, 0.28, 0.08],
    [0.42, 0.14, 0.1],
    [0.02, -0.34, 0.15]
  ] as const

  const scale = clamp(size / 70, 0.75, 1.45)
  const orbs = seeds.map(([dx, dy, radius], index) => {
    const px = clamp(x + dx * 100 * scale, 2, 98)
    const py = clamp(y + dy * 100 * scale, 2, 98)
    const r = Math.max(2.2, radius * size * 0.55)
    const alpha = Math.min(0.7, opacity * (0.35 + (index % 3) * 0.12))
    const tint = tints[index % tints.length]
    return `radial-gradient(circle at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(${tint}, ${alpha.toFixed(2)}) 0%, rgba(${tint}, ${(alpha * 0.4).toFixed(2)}) ${r.toFixed(1)}%, transparent ${(r * 1.85).toFixed(1)}%)`
  })

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(${color}, ${(opacity * 0.22).toFixed(2)}) 0%, transparent ${Math.max(18, size * 0.4).toFixed(1)}%)`,
    ...orbs
  ].join(', ')
}


// --- aurora ---
export const buildAuroraLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const base = parseRgb(color)
  const mint = rgbMix(base, { r: 100, g: 255, b: 190 }, 0.7)
  const violet = rgbMix(base, { r: 210, g: 140, b: 255 }, 0.65)
  const ice = rgbMix(base, { r: 150, g: 225, b: 255 }, 0.6)
  const rose = rgbMix(base, { r: 255, g: 160, b: 220 }, 0.35)
  const a1 = Math.min(0.62, opacity * 0.85 + 0.06)
  const a2 = Math.min(0.52, opacity * 0.7)
  const a3 = Math.min(0.46, opacity * 0.62)
  const a4 = Math.min(0.32, opacity * 0.42)
  const bandH = clamp(size * 0.28, 16, 34)
  const bandW = clamp(size * 1.55, 85, 160)
  const drift = (x - 50) * 0.45
  const lift = (y - 40) * 0.25

  return [
    `radial-gradient(${(bandW * 1.15).toFixed(0)}% ${(bandH * 1.15).toFixed(0)}% at ${(38 + drift).toFixed(1)}% ${(y - 16 + lift).toFixed(1)}%, rgba(${mint}, ${a1.toFixed(2)}) 0%, rgba(${mint}, ${(a1 * 0.4).toFixed(2)}) 38%, transparent 70%)`,
    `radial-gradient(${(bandW * 1.05).toFixed(0)}% ${bandH.toFixed(0)}% at ${(60 + drift * 0.7).toFixed(1)}% ${(y - 2 + lift).toFixed(1)}%, rgba(${ice}, ${a2.toFixed(2)}) 0%, rgba(${ice}, ${(a2 * 0.35).toFixed(2)}) 44%, transparent 72%)`,
    `radial-gradient(${bandW.toFixed(0)}% ${(bandH * 1.1).toFixed(0)}% at ${(44 - drift * 0.5).toFixed(1)}% ${(y + 14 + lift).toFixed(1)}%, rgba(${violet}, ${a3.toFixed(2)}) 0%, rgba(${violet}, ${(a3 * 0.35).toFixed(2)}) 42%, transparent 74%)`,
    `radial-gradient(${(bandW * 0.85).toFixed(0)}% ${(bandH * 0.85).toFixed(0)}% at ${(66 + drift).toFixed(1)}% ${(y + 28 + lift).toFixed(1)}%, rgba(${rose}, ${a4.toFixed(2)}) 0%, transparent 68%)`,
    `radial-gradient(${(bandW * 0.7).toFixed(0)}% ${(bandH * 0.75).toFixed(0)}% at ${(52 + drift * 0.3).toFixed(1)}% ${(y + 8).toFixed(1)}%, rgba(${mint}, ${(a4 * 0.85).toFixed(2)}) 0%, transparent 65%)`,
    `linear-gradient(118deg, transparent 8%, rgba(${ice}, ${(opacity * 0.18).toFixed(2)}) 40%, rgba(${violet}, ${(opacity * 0.12).toFixed(2)}) 62%, transparent 86%)`
  ].join(', ')
}


// --- neon ---
export const buildNeonLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const base = parseRgb(color)
  const magenta = rgbMix(base, { r: 255, g: 70, b: 210 }, 0.55)
  const cyan = rgbMix(base, { r: 70, g: 235, b: 255 }, 0.65)
  const violet = rgbMix(base, { r: 190, g: 100, b: 255 }, 0.4)
  const tip = Math.min(0.72, opacity * 0.85 + 0.1)
  const glow = Math.min(0.42, opacity * 0.58)
  const coreR = Math.max(4.5, size * 0.09)
  const ringInner = Math.max(coreR + 10, size * 0.36)
  const ringMid = ringInner + Math.max(6, size * 0.1)
  const ringOuter = ringMid + Math.max(10, size * 0.16)
  const leftX = clamp(x - size * 0.2, 4, 96)
  const rightX = clamp(x + size * 0.2, 4, 96)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${Math.min(0.95, tip + 0.12).toFixed(2)}) 0%, rgba(${magenta}, ${tip.toFixed(2)}) ${coreR.toFixed(1)}%, rgba(${magenta}, ${(tip * 0.35).toFixed(2)}) ${(coreR * 2.2).toFixed(1)}%, transparent ${(coreR * 3.6).toFixed(1)}%)`,
    `radial-gradient(circle at ${leftX.toFixed(1)}% ${(y - 2).toFixed(1)}%, rgba(${cyan}, ${glow.toFixed(2)}) 0%, rgba(${cyan}, ${(glow * 0.35).toFixed(2)}) ${Math.max(10, size * 0.24).toFixed(1)}%, transparent ${Math.max(26, size * 0.52).toFixed(1)}%)`,
    `radial-gradient(circle at ${rightX.toFixed(1)}% ${(y + 2).toFixed(1)}%, rgba(${magenta}, ${(glow * 0.9).toFixed(2)}) 0%, rgba(${magenta}, ${(glow * 0.3).toFixed(2)}) ${Math.max(10, size * 0.24).toFixed(1)}%, transparent ${Math.max(26, size * 0.52).toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, transparent ${(ringInner - 5).toFixed(1)}%, rgba(${violet}, ${(glow * 0.55).toFixed(2)}) ${ringInner.toFixed(1)}%, rgba(${cyan}, ${(glow * 0.38).toFixed(2)}) ${ringMid.toFixed(1)}%, rgba(${magenta}, ${(glow * 0.18).toFixed(2)}) ${((ringMid + ringOuter) / 2).toFixed(1)}%, transparent ${ringOuter.toFixed(1)}%)`,
    `radial-gradient(ellipse 140% 55% at ${x}% ${y}%, rgba(${cyan}, ${(glow * 0.28).toFixed(2)}) 0%, transparent ${Math.max(42, size * 0.78).toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${(y + size * 0.15).toFixed(1)}%, rgba(${violet}, ${(glow * 0.2).toFixed(2)}) 0%, transparent ${Math.max(20, size * 0.4).toFixed(1)}%)`
  ].join(', ')
}


// --- halo ---
export const buildHaloLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.58, opacity * 0.65 + 0.08)
  const ring = Math.min(0.48, opacity * 0.62)
  const bloom = Math.min(0.24, opacity * 0.32)
  const inner = Math.max(20, size * 0.36)
  const mid = inner + Math.max(7, size * 0.11)
  const outer = mid + Math.max(11, size * 0.16)
  const outerSoft = outer + Math.max(10, size * 0.14)
  const bloomR = Math.max(outerSoft + 10, size * 1.15)
  const base = parseRgb(color)
  const warm = rgbMix(base, { r: 255, g: 235, b: 190 }, 0.35)

  return [
    `radial-gradient(circle at ${x}% ${y}%, transparent ${Math.max(10, inner * 0.55).toFixed(1)}%, rgba(${warm}, ${(ring * 0.3).toFixed(2)}) ${inner.toFixed(1)}%, rgba(255,255,255, ${tip.toFixed(2)}) ${((inner + mid) / 2).toFixed(1)}%, rgba(${color}, ${ring.toFixed(2)}) ${mid.toFixed(1)}%, rgba(${color}, ${(ring * 0.4).toFixed(2)}) ${outer.toFixed(1)}%, rgba(${color}, ${(ring * 0.15).toFixed(2)}) ${outerSoft.toFixed(1)}%, transparent ${(outerSoft + 12).toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, rgba(${color}, ${bloom.toFixed(2)}) 0%, rgba(${warm}, ${(bloom * 0.45).toFixed(2)}) ${(bloomR * 0.55).toFixed(1)}%, transparent ${bloomR.toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, transparent ${(inner - 5).toFixed(1)}%, rgba(255,255,255, ${(tip * 0.35).toFixed(2)}) ${inner.toFixed(1)}%, rgba(${color}, ${(ring * 0.22).toFixed(2)}) ${((inner + mid) / 2).toFixed(1)}%, transparent ${(mid + 6).toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${y}%, transparent ${(outer - 4).toFixed(1)}%, rgba(${warm}, ${(ring * 0.18).toFixed(2)}) ${outer.toFixed(1)}%, transparent ${(outerSoft + 6).toFixed(1)}%)`
  ].join(', ')
}


// --- prisma ---
export const buildPrismaLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.7, opacity * 0.8 + 0.08)
  const split = Math.min(0.4, opacity * 0.55)
  const wash = Math.min(0.18, opacity * 0.25)
  const coreR = Math.max(4, size * 0.08)
  const offset = clamp(size * 0.12, 6, 14)
  const glowR = Math.max(18, size * 0.45)

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${tip.toFixed(2)}) 0%, rgba(${color}, ${(tip * 0.45).toFixed(2)}) ${coreR.toFixed(1)}%, transparent ${(coreR * 2.8).toFixed(1)}%)`,
    `radial-gradient(circle at ${(x - offset).toFixed(1)}% ${y}%, rgba(255,90,130, ${split.toFixed(2)}) 0%, rgba(255,90,130, ${(split * 0.3).toFixed(2)}) ${(glowR * 0.55).toFixed(1)}%, transparent ${glowR.toFixed(1)}%)`,
    `radial-gradient(circle at ${x}% ${(y - offset * 0.6).toFixed(1)}%, rgba(110,255,190, ${(split * 0.85).toFixed(2)}) 0%, rgba(110,255,190, ${(split * 0.25).toFixed(2)}) ${(glowR * 0.5).toFixed(1)}%, transparent ${(glowR * 0.95).toFixed(1)}%)`,
    `radial-gradient(circle at ${(x + offset).toFixed(1)}% ${y}%, rgba(100,160,255, ${split.toFixed(2)}) 0%, rgba(100,160,255, ${(split * 0.3).toFixed(2)}) ${(glowR * 0.55).toFixed(1)}%, transparent ${glowR.toFixed(1)}%)`,
    `radial-gradient(ellipse 110% 45% at ${x}% ${y}%, rgba(255,255,255, ${wash.toFixed(2)}) 0%, transparent ${Math.max(32, size * 0.65).toFixed(1)}%)`,
    `conic-gradient(from 200deg at ${x}% ${y}%, transparent 0deg, rgba(255,120,160, ${(wash * 0.7).toFixed(2)}) 40deg, transparent 70deg, rgba(120,255,200, ${(wash * 0.6).toFixed(2)}) 140deg, transparent 170deg, rgba(120,170,255, ${(wash * 0.7).toFixed(2)}) 240deg, transparent 280deg, transparent 360deg)`
  ].join(', ')
}


// --- eco ---
export const buildEcoLight = (input: LightBuildInput): string | undefined => {
  const { opacity, size, color, focus } = input
  if (opacity <= 0 || size <= 0) return undefined
  const x = focus.x * 100
  const y = focus.y * 100
  const tip = Math.min(0.55, opacity * 0.65 + 0.06)
  const ring = Math.min(0.38, opacity * 0.5)
  const r1 = Math.max(10, size * 0.18)
  const r2 = Math.max(r1 + 10, size * 0.36)
  const r3 = Math.max(r2 + 12, size * 0.56)
  const r4 = Math.max(r3 + 14, size * 0.78)
  const soft = (inner: number, outer: number, alpha: number) =>
    `radial-gradient(circle at ${x}% ${y}%, transparent ${(inner - 3).toFixed(1)}%, rgba(${color}, ${alpha.toFixed(2)}) ${inner.toFixed(1)}%, rgba(${color}, ${(alpha * 0.45).toFixed(2)}) ${((inner + outer) / 2).toFixed(1)}%, transparent ${outer.toFixed(1)}%)`

  return [
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255, ${tip.toFixed(2)}) 0%, rgba(${color}, ${(tip * 0.45).toFixed(2)}) ${Math.max(3, r1 * 0.35).toFixed(1)}%, transparent ${r1.toFixed(1)}%)`,
    soft(r1, r1 + Math.max(6, size * 0.08), ring),
    soft(r2, r2 + Math.max(8, size * 0.1), ring * 0.7),
    soft(r3, r3 + Math.max(10, size * 0.12), ring * 0.48),
    soft(r4, r4 + Math.max(12, size * 0.14), ring * 0.28),
    `radial-gradient(circle at ${x}% ${y}%, rgba(${color}, ${(ring * 0.18).toFixed(2)}) 0%, transparent ${Math.max(40, size * 0.85).toFixed(1)}%)`
  ].join(', ')
}

