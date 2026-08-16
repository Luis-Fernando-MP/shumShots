import {
  clampSlotQuantity,
  SLOT_QUANTITY_CONFIG
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'
import {
  ColumnPreview,
  DiagonalPreview,
  FanPreview,
  GridPreview,
  OrbitPreview,
  soloPreview,
  StackPreview,
  StaggerPreview
} from '@views/image-studio/Popups/CanvasImages/Layout/components/position-previews'
import type { ComponentType } from 'react'

import * as five from './five.build'
import * as four from './four.build'
import * as one from './one.build'
import * as three from './three.build'
import * as two from './two.build'
import type { SlotBuildContext, SlotPlacement } from './types'

type PreviewProps = { active?: boolean; count: number }

export type SlotPositionEntry = {
  id: string
  key: string
  title: string
  description: string
  is3d: boolean
  builder: (ctx: SlotBuildContext) => SlotPlacement[]
  preview: ComponentType<PreviewProps>
}

const META = {
  grid: {
    id: 'grid',
    key: 'grid',
    title: 'Cuadrícula',
    description: 'Orden limpio sin solape',
    is3d: false,
    preview: GridPreview
  },
  stagger: {
    id: 'stagger',
    key: 'stagger',
    title: 'Escalonado',
    description: 'Fila con offset vertical',
    is3d: false,
    preview: StaggerPreview
  },
  stack: {
    id: 'stack',
    key: 'stack',
    title: 'Apilado',
    description: 'Solape hacia abajo-derecha',
    is3d: false,
    preview: StackPreview
  },
  'stack-balanced': {
    id: 'stack-balanced',
    key: 'stack-balanced',
    title: 'Apilado suave',
    description: 'Solape equilibrado',
    is3d: false,
    preview: StackPreview
  },
  fan: {
    id: 'fan',
    key: 'fan',
    title: 'Abanico',
    description: 'Rotación en abanico',
    is3d: false,
    preview: FanPreview
  },
  'fan-tilt': {
    id: 'fan-tilt',
    key: 'fan-tilt',
    title: 'Abanico inclinado',
    description: 'Ángulos irregulares',
    is3d: false,
    preview: FanPreview
  },
  diagonal: {
    id: 'diagonal',
    key: 'diagonal',
    title: 'Diagonal',
    description: 'Esquinas opuestas',
    is3d: false,
    preview: DiagonalPreview
  },
  perspective: {
    id: 'perspective',
    key: 'perspective',
    title: 'Perspectiva',
    description: 'Inclinación 3D',
    is3d: true,
    preview: FanPreview
  },
  column: {
    id: 'column',
    key: 'column',
    title: 'Columna',
    description: 'Apilado vertical centrado',
    is3d: false,
    preview: ColumnPreview
  },
  orbit: {
    id: 'orbit',
    key: 'orbit',
    title: 'Órbita',
    description: 'Disposición circular 3D',
    is3d: true,
    preview: OrbitPreview
  }
} as const

const ONE_META = {
  grid: {
    id: 'grid',
    key: 'grid',
    title: 'Centro',
    description: 'Centrado, sin giro',
    is3d: false,
    preview: soloPreview({ left: 28, top: 22, w: 44, h: 56 })
  },
  'center-tilt': {
    id: 'center-tilt',
    key: 'center-tilt',
    title: 'Inclinado',
    description: 'Centro con giro suave',
    is3d: false,
    preview: soloPreview({ left: 28, top: 22, w: 44, h: 56, rotateZ: -8 })
  },
  'center-tilt-right': {
    id: 'center-tilt-right',
    key: 'center-tilt-right',
    title: 'Giro derecho',
    description: 'Centro rotado a la derecha',
    is3d: false,
    preview: soloPreview({ left: 28, top: 22, w: 44, h: 56, rotateZ: 12 })
  },
  hero: {
    id: 'hero',
    key: 'hero',
    title: 'Héroe',
    description: 'Grande al centro',
    is3d: false,
    preview: soloPreview({ left: 18, top: 14, w: 64, h: 72 })
  },
  'bottom-right': {
    id: 'bottom-right',
    key: 'bottom-right',
    title: 'Abajo der.',
    description: 'Sale por la esquina inferior derecha',
    is3d: false,
    preview: soloPreview({ left: 48, top: 46, w: 56, h: 60 })
  },
  'bottom-left': {
    id: 'bottom-left',
    key: 'bottom-left',
    title: 'Abajo izq.',
    description: 'Sale por la esquina inferior izquierda',
    is3d: false,
    preview: soloPreview({ left: -8, top: 46, w: 56, h: 60 })
  },
  'top-right': {
    id: 'top-right',
    key: 'top-right',
    title: 'Arriba der.',
    description: 'Sale por la esquina superior derecha',
    is3d: false,
    preview: soloPreview({ left: 50, top: -8, w: 54, h: 56 })
  },
  'top-left': {
    id: 'top-left',
    key: 'top-left',
    title: 'Arriba izq.',
    description: 'Sale por la esquina superior izquierda',
    is3d: false,
    preview: soloPreview({ left: -8, top: -8, w: 54, h: 56 })
  },
  'offset-right': {
    id: 'offset-right',
    key: 'offset-right',
    title: 'Desplazado',
    description: 'A la derecha, leve giro',
    is3d: false,
    preview: soloPreview({ left: 40, top: 22, w: 48, h: 54, rotateZ: 5 })
  },
  low: {
    id: 'low',
    key: 'low',
    title: 'Bajo',
    description: 'Bajo al centro',
    is3d: false,
    preview: soloPreview({ left: 24, top: 42, w: 52, h: 50 })
  },
  editorial: {
    id: 'editorial',
    key: 'editorial',
    title: 'Editorial',
    description: 'Offset izquierdo, giro fino',
    is3d: false,
    preview: soloPreview({ left: 12, top: 20, w: 42, h: 52, rotateZ: -5 })
  },
  'yaw-right': {
    id: 'yaw-right',
    key: 'yaw-right',
    title: 'Persp. der.',
    description: 'Giro 3D hacia la derecha',
    is3d: true,
    preview: soloPreview({ left: 24, top: 18, w: 50, h: 58, rotateY: -28, rotateX: 4 })
  },
  'yaw-left': {
    id: 'yaw-left',
    key: 'yaw-left',
    title: 'Persp. izq.',
    description: 'Giro 3D hacia la izquierda',
    is3d: true,
    preview: soloPreview({ left: 24, top: 18, w: 50, h: 58, rotateY: 28, rotateX: 4 })
  },
  pitch: {
    id: 'pitch',
    key: 'pitch',
    title: 'Inclinación',
    description: 'Perspectiva hacia atrás',
    is3d: true,
    preview: soloPreview({ left: 24, top: 16, w: 50, h: 62, rotateX: 18 })
  },
  float: {
    id: 'float',
    key: 'float',
    title: 'Flotante',
    description: 'Sale en esquina con giro 3D',
    is3d: true,
    preview: soloPreview({ left: 50, top: 48, w: 54, h: 56, rotateZ: 6, rotateY: -18, rotateX: 4 })
  },
  'crop-right': {
    id: 'crop-right',
    key: 'crop-right',
    title: 'Sale der.',
    description: 'Cortado por el borde derecho',
    is3d: false,
    preview: soloPreview({ left: 52, top: 18, w: 58, h: 64 })
  },
  'crop-bottom': {
    id: 'crop-bottom',
    key: 'crop-bottom',
    title: 'Sale abajo',
    description: 'Cortado por el borde inferior',
    is3d: false,
    preview: soloPreview({ left: 22, top: 48, w: 56, h: 62 })
  },
  'crop-3d': {
    id: 'crop-3d',
    key: 'crop-3d',
    title: 'Sale 3D',
    description: 'Esquina recortada con perspectiva',
    is3d: true,
    preview: soloPreview({ left: 46, top: 42, w: 58, h: 62, rotateY: -24, rotateX: 6 })
  }
} as const

const withCatalog = (
  meta: Record<string, Omit<SlotPositionEntry, 'builder'>>,
  source: Record<string, (ctx: SlotBuildContext) => SlotPlacement[]>
): Record<string, SlotPositionEntry> => {
  const catalog: Record<string, SlotPositionEntry> = {}
  for (const [id, builder] of Object.entries(source)) {
    const entry = meta[id]
    if (!entry) continue
    catalog[id] = { ...entry, builder }
  }
  return catalog
}

const withBuilders = (
  source: Record<string, (ctx: SlotBuildContext) => SlotPlacement[]>
): Record<string, SlotPositionEntry> => withCatalog(META, source)

export const SLOT_POSITION_LIST = {
  [SLOT_QUANTITY_CONFIG.ONE]: withCatalog(ONE_META, {
    grid: one.buildGrid,
    'center-tilt': one.buildCenterTilt,
    'center-tilt-right': one.buildCenterTiltRight,
    hero: one.buildHero,
    'bottom-right': one.buildBottomRight,
    'bottom-left': one.buildBottomLeft,
    'top-right': one.buildTopRight,
    'top-left': one.buildTopLeft,
    'offset-right': one.buildOffsetRight,
    low: one.buildLowCenter,
    editorial: one.buildEditorial,
    'yaw-right': one.buildYawRight,
    'yaw-left': one.buildYawLeft,
    pitch: one.buildPitch,
    float: one.buildFloatCorner,
    'crop-right': one.buildCropRight,
    'crop-bottom': one.buildCropBottom,
    'crop-3d': one.buildCrop3d
  }),
  [SLOT_QUANTITY_CONFIG.TWO]: withBuilders({
    grid: two.buildGrid,
    stagger: two.buildStagger,
    stack: two.buildStack,
    'stack-balanced': two.buildStackBalanced,
    fan: two.buildFan,
    'fan-tilt': two.buildFanTilt,
    diagonal: two.buildDiagonal,
    perspective: two.buildPerspective,
    column: two.buildColumn,
    orbit: two.buildOrbit
  }),
  [SLOT_QUANTITY_CONFIG.THREE]: withBuilders({
    grid: three.buildGrid,
    stagger: three.buildStagger,
    stack: three.buildStack,
    'stack-balanced': three.buildStackBalanced,
    fan: three.buildFan,
    'fan-tilt': three.buildFanTilt,
    diagonal: three.buildDiagonal,
    perspective: three.buildPerspective,
    column: three.buildColumn,
    orbit: three.buildOrbit
  }),
  [SLOT_QUANTITY_CONFIG.FOUR]: withBuilders({
    grid: four.buildGrid,
    stagger: four.buildStagger,
    stack: four.buildStack,
    'stack-balanced': four.buildStackBalanced,
    fan: four.buildFan,
    'fan-tilt': four.buildFanTilt,
    diagonal: four.buildDiagonal,
    perspective: four.buildPerspective,
    column: four.buildColumn,
    orbit: four.buildOrbit
  }),
  [SLOT_QUANTITY_CONFIG.FIVE]: withBuilders({
    grid: five.buildGrid,
    stagger: five.buildStagger,
    stack: five.buildStack,
    'stack-balanced': five.buildStackBalanced,
    fan: five.buildFan,
    'fan-tilt': five.buildFanTilt,
    diagonal: five.buildDiagonal,
    perspective: five.buildPerspective,
    column: five.buildColumn,
    orbit: five.buildOrbit
  })
} as const

export type SlotPositionId = string

export const DEFAULT_POSITION_ID = META.grid.id

export const getPositionsForCount = (count: number): SlotPositionEntry[] =>
  Object.values(SLOT_POSITION_LIST[clampSlotQuantity(count)])

export const getPositionEntry = (count: number, positionId: string): SlotPositionEntry => {
  const catalog = SLOT_POSITION_LIST[clampSlotQuantity(count)]
  return catalog[positionId] ?? catalog[DEFAULT_POSITION_ID] ?? Object.values(catalog)[0]
}
