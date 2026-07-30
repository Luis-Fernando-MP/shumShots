import {
  ColumnPreview,
  DiagonalPreview,
  FanPreview,
  GridPreview,
  OrbitPreview,
  StackPreview,
  StaggerPreview
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/components/position-previews'
import type { ComponentType } from 'react'

import {
  buildColumn,
  buildDiagonal,
  buildFan,
  buildFanTilt,
  buildGrid,
  buildOrbit,
  buildPerspective,
  buildStack,
  buildStackBalanced,
  buildStagger
} from './builders'
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

export const SLOT_POSITION_LIST: SlotPositionEntry[] = [
  {
    id: 'grid',
    key: 'grid',
    title: 'Cuadrícula',
    description: 'Orden limpio sin solape',
    is3d: false,
    builder: buildGrid,
    preview: GridPreview
  },
  {
    id: 'stagger',
    key: 'stagger',
    title: 'Escalonado',
    description: 'Fila con offset vertical',
    is3d: false,
    builder: buildStagger,
    preview: StaggerPreview
  },
  {
    id: 'stack',
    key: 'stack',
    title: 'Apilado',
    description: 'Solape hacia abajo-derecha',
    is3d: false,
    builder: buildStack,
    preview: StackPreview
  },
  {
    id: 'stack-balanced',
    key: 'stack-balanced',
    title: 'Apilado suave',
    description: 'Solape equilibrado',
    is3d: false,
    builder: buildStackBalanced,
    preview: StackPreview
  },
  {
    id: 'fan',
    key: 'fan',
    title: 'Abanico',
    description: 'Rotación en abanico',
    is3d: false,
    builder: buildFan,
    preview: FanPreview
  },
  {
    id: 'fan-tilt',
    key: 'fan-tilt',
    title: 'Abanico inclinado',
    description: 'Ángulos irregulares',
    is3d: false,
    builder: buildFanTilt,
    preview: FanPreview
  },
  {
    id: 'diagonal',
    key: 'diagonal',
    title: 'Diagonal',
    description: 'Esquinas opuestas',
    is3d: false,
    builder: buildDiagonal,
    preview: DiagonalPreview
  },
  {
    id: 'perspective',
    key: 'perspective',
    title: 'Perspectiva',
    description: 'Inclinación 3D',
    is3d: true,
    builder: buildPerspective,
    preview: FanPreview
  },
  {
    id: 'column',
    key: 'column',
    title: 'Columna',
    description: 'Apilado vertical centrado',
    is3d: false,
    builder: buildColumn,
    preview: ColumnPreview
  },
  {
    id: 'orbit',
    key: 'orbit',
    title: 'Órbita',
    description: 'Disposición circular 3D',
    is3d: true,
    builder: buildOrbit,
    preview: OrbitPreview
  }
]

export const SLOT_POSITIONS = Object.fromEntries(
  SLOT_POSITION_LIST.map(entry => [entry.id, entry])
) as Record<string, SlotPositionEntry>

export type SlotPositionId = string

export const DEFAULT_POSITION_ID = 'grid'

export const getPositionEntry = (positionId: string): SlotPositionEntry =>
  SLOT_POSITIONS[positionId] ?? SLOT_POSITION_LIST[0]
