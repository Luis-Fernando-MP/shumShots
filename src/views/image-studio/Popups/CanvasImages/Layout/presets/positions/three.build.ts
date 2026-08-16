import { SLOT_QUANTITY_CONFIG } from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'

import { buildSlots, clamp } from './helpers'
import type { SlotBuildContext, SlotPlacement } from './types'

const N = SLOT_QUANTITY_CONFIG.THREE
const COLS = 3
const MID = (N - 1) / 2
const ANGLES = [-8, 16, -4]

export const buildGrid = (ctx: SlotBuildContext): SlotPlacement[] => {
  const gapX = ctx.canvasWidth * 0.03
  const gapY = ctx.canvasHeight * 0.03
  return buildSlots(N, ctx, (index, size) => {
    const col = index % COLS
    const row = Math.floor(index / COLS)
    return {
      x: col * (size.width + gapX),
      y: row * (size.height + gapY)
    }
  })
}

export const buildStagger = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => ({
    x: index * (size.width * 0.85),
    y: (index % 2) * size.height * 0.22
  }))

export const buildStack = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const offset = index * Math.min(size.width, size.height) * 0.12
    return { x: offset, y: offset }
  })

export const buildStackBalanced = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const t = index / (N - 1)
    const offset = t * Math.min(size.width, size.height) * 0.28
    return { x: offset, y: offset * 0.85 }
  })

export const buildFan = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const delta = index - MID
    return {
      x: index * size.width * 0.18,
      y: Math.abs(delta) * size.height * 0.06,
      rotateZ: delta * 8
    }
  })

export const buildFanTilt = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => ({
    x: index * size.width * 0.22,
    y: (index % 2) * size.height * 0.1,
    rotateZ: ANGLES[index]
  }))

export const buildDiagonal = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const t = index / (N - 1)
    return {
      x: t * Math.max(0, ctx.canvasWidth - size.width),
      y: (1 - t) * Math.max(0, ctx.canvasHeight - size.height)
    }
  })

export const buildPerspective = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const delta = index - MID
    return {
      x: index * size.width * 0.2,
      y: Math.abs(delta) * size.height * 0.08,
      rotateZ: delta * 3,
      rotateX: clamp(8 + Math.abs(delta) * 2, 0, 18),
      rotateY: clamp(delta * -6, -16, 16)
    }
  })

export const buildColumn = (ctx: SlotBuildContext): SlotPlacement[] => {
  const gapY = ctx.canvasHeight * 0.025
  return buildSlots(N, ctx, (index, size) => ({
    x: (ctx.canvasWidth - size.width) / 2,
    y: index * (size.height + gapY)
  }))
}

export const buildOrbit = (ctx: SlotBuildContext): SlotPlacement[] =>
  buildSlots(N, ctx, (index, size) => {
    const angle = (index / N) * Math.PI * 2
    const radius = Math.min(ctx.canvasWidth, ctx.canvasHeight) * 0.18
    return {
      x: ctx.canvasWidth / 2 - size.width / 2 + Math.cos(angle) * radius,
      y: ctx.canvasHeight / 2 - size.height / 2 + Math.sin(angle) * radius * 0.7,
      rotateZ: (angle * 180) / Math.PI,
      rotateX: 10,
      rotateY: clamp(Math.sin(angle) * 12, -14, 14)
    }
  })
