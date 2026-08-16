import { placeSolo, type SoloPose } from './helpers'
import type { SlotBuildContext, SlotPlacement } from './types'

export const ONE_POSES = {
  grid: { ax: 0.5, ay: 0.5 },
  'center-tilt': { ax: 0.5, ay: 0.5, rotateZ: -8 },
  'center-tilt-right': { ax: 0.5, ay: 0.5, rotateZ: 12 },
  hero: { ax: 0.5, ay: 0.5, scale: 1.28 },
  'bottom-right': { ax: 1, ay: 1, scale: 1.08, bleed: 0.22 },
  'bottom-left': { ax: 0, ay: 1, scale: 1.08, bleed: 0.22 },
  'top-right': { ax: 1, ay: 0, scale: 1.02, bleed: 0.18 },
  'top-left': { ax: 0, ay: 0, scale: 1.02, bleed: 0.18 },
  'offset-right': { ax: 0.82, ay: 0.48, rotateZ: 5, scale: 0.95 },
  low: { ax: 0.5, ay: 0.88, scale: 1.08 },
  editorial: { ax: 0.32, ay: 0.42, rotateZ: -5, scale: 0.9 },
  'yaw-right': { ax: 0.52, ay: 0.5, rotateY: -28, rotateX: 4, scale: 1.06 },
  'yaw-left': { ax: 0.48, ay: 0.5, rotateY: 28, rotateX: 4, scale: 1.06 },
  pitch: { ax: 0.5, ay: 0.48, rotateX: 18, scale: 1.08 },
  float: {
    ax: 1,
    ay: 1,
    rotateZ: 6,
    rotateY: -18,
    rotateX: 4,
    scale: 0.92,
    bleed: 0.2
  },
  'crop-right': { ax: 1, ay: 0.5, scale: 1.12, bleed: 0.28 },
  'crop-bottom': { ax: 0.5, ay: 1, scale: 1.15, bleed: 0.24 },
  'crop-3d': {
    ax: 1,
    ay: 1,
    scale: 1.14,
    bleed: 0.26,
    rotateY: -24,
    rotateX: 6
  }
} as const satisfies Record<string, SoloPose>

const solo = (pose: SoloPose) => (ctx: SlotBuildContext): SlotPlacement[] => placeSolo(ctx, pose)

export const getOnePose = (id: string): SoloPose => {
  if (id in ONE_POSES) return ONE_POSES[id as keyof typeof ONE_POSES]
  return ONE_POSES.grid
}

export const buildGrid = solo(ONE_POSES.grid)
export const buildCenterTilt = solo(ONE_POSES['center-tilt'])
export const buildCenterTiltRight = solo(ONE_POSES['center-tilt-right'])
export const buildHero = solo(ONE_POSES.hero)
export const buildBottomRight = solo(ONE_POSES['bottom-right'])
export const buildBottomLeft = solo(ONE_POSES['bottom-left'])
export const buildTopRight = solo(ONE_POSES['top-right'])
export const buildTopLeft = solo(ONE_POSES['top-left'])
export const buildOffsetRight = solo(ONE_POSES['offset-right'])
export const buildLowCenter = solo(ONE_POSES.low)
export const buildEditorial = solo(ONE_POSES.editorial)
export const buildYawRight = solo(ONE_POSES['yaw-right'])
export const buildYawLeft = solo(ONE_POSES['yaw-left'])
export const buildPitch = solo(ONE_POSES.pitch)
export const buildFloatCorner = solo(ONE_POSES.float)
export const buildCropRight = solo(ONE_POSES['crop-right'])
export const buildCropBottom = solo(ONE_POSES['crop-bottom'])
export const buildCrop3d = solo(ONE_POSES['crop-3d'])
