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

export const fitSizeKeepAspect = (
  size: { width: number; height: number },
  ctx: SlotBuildContext,
  maxRatio = PARENT_FIT_RATIO
) => {
  if (!ctx.constrainToParent) return size
  const scale = Math.min(1, (ctx.canvasWidth * maxRatio) / size.width, (ctx.canvasHeight * maxRatio) / size.height)
  return { width: size.width * scale, height: size.height * scale }
}

export type SoloPose = {
  ax?: number
  ay?: number
  inset?: number
  scale?: number
  bleed?: number
  rotateZ?: number
  rotateX?: number
  rotateY?: number
}

export const DEFAULT_SOLO_POSE: Required<SoloPose> = {
  ax: 0.5,
  ay: 0.5,
  inset: 0.05,
  scale: 1,
  bleed: 0,
  rotateZ: 0,
  rotateX: 0,
  rotateY: 0
}

export const resolveSoloPose = (pose: SoloPose = {}): Required<SoloPose> => ({
  ...DEFAULT_SOLO_POSE,
  ...pose
})

export const placeSolo = (ctx: SlotBuildContext, pose: SoloPose = {}): SlotPlacement[] => {
  const user = sizeAt(ctx, 0)
  const scale = pose.scale ?? 1
  const bleed = Math.max(0, pose.bleed ?? 0)
  const sized = { width: user.width * scale, height: user.height * scale }
  const size = bleed > 0 ? sized : fitSizeKeepAspect(sized, ctx)
  const ax = pose.ax ?? 0.5
  const ay = pose.ay ?? 0.5

  if (bleed > 0) {
    return [
      {
        x: (ctx.canvasWidth - size.width) * ax + (ax - 0.5) * 2 * size.width * bleed,
        y: (ctx.canvasHeight - size.height) * ay + (ay - 0.5) * 2 * size.height * bleed,
        width: size.width,
        height: size.height,
        rotateZ: pose.rotateZ ?? 0,
        rotateX: pose.rotateX ?? 0,
        rotateY: pose.rotateY ?? 0,
        zIndex: 0
      }
    ]
  }

  const inset = pose.inset ?? 0.05
  const padX = ctx.canvasWidth * inset
  const padY = ctx.canvasHeight * inset
  const spanX = Math.max(0, ctx.canvasWidth - size.width - padX * 2)
  const spanY = Math.max(0, ctx.canvasHeight - size.height - padY * 2)

  return [
    {
      x: padX + spanX * ax,
      y: padY + spanY * ay,
      width: size.width,
      height: size.height,
      rotateZ: pose.rotateZ ?? 0,
      rotateX: pose.rotateX ?? 0,
      rotateY: pose.rotateY ?? 0,
      zIndex: 0
    }
  ]
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
