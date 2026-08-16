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

const withBuilders = (
  source: Record<string, (ctx: SlotBuildContext) => SlotPlacement[]>
): Record<string, SlotPositionEntry> => {
  const catalog: Record<string, SlotPositionEntry> = {}
  for (const [id, builder] of Object.entries(source)) {
    const meta = META[id as keyof typeof META]
    if (!meta) continue
    catalog[id] = { ...meta, builder }
  }
  return catalog
}

export const SLOT_POSITION_LIST = {
  [SLOT_QUANTITY_CONFIG.ONE]: withBuilders({
    grid: one.buildGrid
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
