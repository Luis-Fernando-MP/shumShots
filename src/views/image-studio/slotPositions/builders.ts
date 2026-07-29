import {
  PARENT_FIT_RATIO,
  type SlotBuildContext,
  type SlotPlacement
} from './types'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const fitGroup = (
  placements: SlotPlacement[],
  ctx: SlotBuildContext,
  allowOverlap: boolean
): SlotPlacement[] => {
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
  let scale = Math.min(1, maxW / groupW, maxH / groupH)

  if (!allowOverlap && placements.length > 1) {
    // keep aspect; scale already prevents overflow of bbox
  }

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

const sizeAt = (ctx: SlotBuildContext, index: number) =>
  ctx.slotSizes[index] ?? ctx.slotSizes[0] ?? { width: 420, height: 315 }

export const buildGrid = (ctx: SlotBuildContext): SlotPlacement[] => {
  const cols = ctx.count <= 3 ? ctx.count : ctx.count === 4 ? 2 : 3
  const rows = Math.ceil(ctx.count / cols)
  const gapX = ctx.canvasWidth * 0.03
  const gapY = ctx.canvasHeight * 0.03

  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      x: col * (size.width + gapX),
      y: row * (size.height + gapY),
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })

  return fitGroup(base, ctx, false)
}

export const buildStagger = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const staggerY = (index % 2) * size.height * 0.22
    return {
      x: index * (size.width * 0.85),
      y: staggerY,
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, false)
}

export const buildStack = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const offset = index * Math.min(size.width, size.height) * 0.12
    return {
      x: offset,
      y: offset,
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}

export const buildStackBalanced = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const t = ctx.count <= 1 ? 0 : index / (ctx.count - 1)
    const offset = t * Math.min(size.width, size.height) * 0.28
    return {
      x: offset,
      y: offset * 0.85,
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}

export const buildFan = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const mid = (ctx.count - 1) / 2
    const delta = index - mid
    const rotateZ = delta * 8
    return {
      x: index * size.width * 0.18,
      y: Math.abs(delta) * size.height * 0.06,
      width: size.width,
      height: size.height,
      rotateZ,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}

export const buildFanTilt = (ctx: SlotBuildContext): SlotPlacement[] => {
  const angles = [-8, 16, -4, 12, 6]
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    return {
      x: index * size.width * 0.22,
      y: (index % 2) * size.height * 0.1,
      width: size.width,
      height: size.height,
      rotateZ: angles[index % angles.length],
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}

export const buildDiagonal = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const t = ctx.count <= 1 ? 0 : index / (ctx.count - 1)
    return {
      x: t * Math.max(0, ctx.canvasWidth - size.width),
      y: (1 - t) * Math.max(0, ctx.canvasHeight - size.height),
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, false)
}

export const buildPerspective = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const mid = (ctx.count - 1) / 2
    const delta = index - mid
    return {
      x: index * size.width * 0.2,
      y: Math.abs(delta) * size.height * 0.08,
      width: size.width,
      height: size.height,
      rotateZ: delta * 3,
      rotateX: clamp(8 + Math.abs(delta) * 2, 0, 18),
      rotateY: clamp(delta * -6, -16, 16),
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}

export const buildColumn = (ctx: SlotBuildContext): SlotPlacement[] => {
  const gapY = ctx.canvasHeight * 0.025
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    return {
      x: (ctx.canvasWidth - size.width) / 2,
      y: index * (size.height + gapY),
      width: size.width,
      height: size.height,
      rotateZ: 0,
      rotateX: 0,
      rotateY: 0,
      zIndex: index
    }
  })
  return fitGroup(base, ctx, false)
}

export const buildOrbit = (ctx: SlotBuildContext): SlotPlacement[] => {
  const base = Array.from({ length: ctx.count }, (_, index) => {
    const size = sizeAt(ctx, index)
    const angle = ctx.count <= 1 ? 0 : (index / ctx.count) * Math.PI * 2
    const radius = Math.min(ctx.canvasWidth, ctx.canvasHeight) * 0.18
    const cx = ctx.canvasWidth / 2 - size.width / 2
    const cy = ctx.canvasHeight / 2 - size.height / 2
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.7,
      width: size.width,
      height: size.height,
      rotateZ: (angle * 180) / Math.PI,
      rotateX: 10,
      rotateY: clamp(Math.sin(angle) * 12, -14, 14),
      zIndex: index
    }
  })
  return fitGroup(base, ctx, true)
}
