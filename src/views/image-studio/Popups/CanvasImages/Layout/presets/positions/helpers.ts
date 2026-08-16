import { PARENT_FIT_RATIO, type SlotBuildContext, type SlotPlacement } from './types'

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const sizeAt = (ctx: SlotBuildContext, index: number) =>
  ctx.slotSizes[index] ?? ctx.slotSizes[0] ?? { width: 420, height: 315 }

export const fitGroup = (placements: SlotPlacement[], ctx: SlotBuildContext): SlotPlacement[] => {
  if (!ctx.constrainToParent || placements.length === 0) return placements

  const maxW = ctx.canvasWidth * PARENT_FIT_RATIO
  const maxH = ctx.canvasHeight * PARENT_FIT_RATIO

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const p of placements) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x + p.width)
    maxY = Math.max(maxY, p.y + p.height)
  }

  const groupW = Math.max(1, maxX - minX)
  const groupH = Math.max(1, maxY - minY)
  const scale = Math.min(1, maxW / groupW, maxH / groupH)

  const scaled = placements.map(p => ({
    ...p,
    x: (p.x - minX) * scale,
    y: (p.y - minY) * scale,
    width: p.width * scale,
    height: p.height * scale
  }))

  let sMinX = Infinity
  let sMinY = Infinity
  let sMaxX = -Infinity
  let sMaxY = -Infinity
  for (const p of scaled) {
    sMinX = Math.min(sMinX, p.x)
    sMinY = Math.min(sMinY, p.y)
    sMaxX = Math.max(sMaxX, p.x + p.width)
    sMaxY = Math.max(sMaxY, p.y + p.height)
  }

  const offsetX = (ctx.canvasWidth - (sMaxX - sMinX)) / 2 - sMinX
  const offsetY = (ctx.canvasHeight - (sMaxY - sMinY)) / 2 - sMinY

  return scaled.map(p => ({
    ...p,
    x: p.x + offsetX,
    y: p.y + offsetY
  }))
}

type SlotPoint = {
  x: number
  y: number
  rotateZ?: number
  rotateX?: number
  rotateY?: number
  zIndex?: number
}

export const buildSlots = (
  count: number,
  ctx: SlotBuildContext,
  at: (index: number, size: { width: number; height: number }) => SlotPoint
): SlotPlacement[] => {
  const base = Array.from({ length: count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const point = at(index, size)
    return {
      x: point.x,
      y: point.y,
      width: size.width,
      height: size.height,
      rotateZ: point.rotateZ ?? 0,
      rotateX: point.rotateX ?? 0,
      rotateY: point.rotateY ?? 0,
      zIndex: point.zIndex ?? index
    }
  })
  return fitGroup(base, ctx)
}
