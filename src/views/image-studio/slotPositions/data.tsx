import type { FC } from 'react'

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

type PreviewProps = { active?: boolean }

const MiniBoxes: FC<PreviewProps & { pattern: 'grid' | 'stagger' | 'stack' | 'fan' | 'diagonal' | 'column' | 'orbit' }> = ({
  active,
  pattern
}) => {
  const fill = active ? 'bg-primary' : 'bg-foreground/30'
  if (pattern === 'stagger') {
    return (
      <div className='relative h-10 w-full'>
        <div className={`absolute left-[8%] top-[8%] h-[42%] w-[40%] rounded-[2px] ${fill}`} />
        <div className={`absolute right-[8%] top-[28%] h-[42%] w-[40%] rounded-[2px] ${fill}`} />
      </div>
    )
  }
  if (pattern === 'stack') {
    return (
      <div className='relative h-10 w-full'>
        <div className={`absolute left-[18%] top-[12%] h-[55%] w-[52%] rounded-[2px] ${fill} opacity-70`} />
        <div className={`absolute left-[28%] top-[28%] h-[55%] w-[52%] rounded-[2px] ${fill}`} />
      </div>
    )
  }
  if (pattern === 'fan') {
    return (
      <div className='relative h-10 w-full'>
        <div
          className={`absolute left-[16%] top-[18%] h-[50%] w-[48%] origin-bottom rounded-[2px] ${fill} opacity-70`}
          style={{ transform: 'rotate(-10deg)' }}
        />
        <div
          className={`absolute left-[30%] top-[22%] h-[50%] w-[48%] origin-bottom rounded-[2px] ${fill}`}
          style={{ transform: 'rotate(12deg)' }}
        />
      </div>
    )
  }
  if (pattern === 'diagonal') {
    return (
      <div className='relative h-10 w-full'>
        <div className={`absolute bottom-[10%] left-[8%] h-[40%] w-[38%] rounded-[2px] ${fill}`} />
        <div className={`absolute right-[8%] top-[10%] h-[40%] w-[38%] rounded-[2px] ${fill}`} />
      </div>
    )
  }
  if (pattern === 'column') {
    return (
      <div className='relative h-10 w-full'>
        <div className={`absolute left-[30%] top-[6%] h-[28%] w-[40%] rounded-[2px] ${fill}`} />
        <div className={`absolute left-[30%] top-[38%] h-[28%] w-[40%] rounded-[2px] ${fill}`} />
        <div className={`absolute left-[30%] top-[70%] h-[22%] w-[40%] rounded-[2px] ${fill}`} />
      </div>
    )
  }
  if (pattern === 'orbit') {
    return (
      <div className='relative h-10 w-full'>
        <div className={`absolute left-[38%] top-[8%] h-[34%] w-[28%] rounded-[2px] ${fill}`} />
        <div className={`absolute left-[12%] top-[42%] h-[34%] w-[28%] rounded-[2px] ${fill} opacity-70`} />
        <div className={`absolute right-[12%] top-[42%] h-[34%] w-[28%] rounded-[2px] ${fill} opacity-70`} />
      </div>
    )
  }
  return (
    <div className='relative h-10 w-full'>
      <div className={`absolute left-[12%] top-[22%] h-[48%] w-[34%] rounded-[2px] ${fill}`} />
      <div className={`absolute right-[12%] top-[22%] h-[48%] w-[34%] rounded-[2px] ${fill}`} />
    </div>
  )
}

export type SlotPositionEntry = {
  id: string
  title: string
  description: string
  count: number
  is3d: boolean
  builder: (ctx: SlotBuildContext) => SlotPlacement[]
  preview?: FC<PreviewProps>
}

type FamilyDef = {
  key: string
  title: string
  description: string
  is3d: boolean
  builder: (ctx: SlotBuildContext) => SlotPlacement[]
  preview: FC<PreviewProps>
}

const COUNTS = [1, 2, 3, 4, 5] as const

const FAMILIES: FamilyDef[] = [
  {
    key: 'grid',
    title: 'Cuadrícula',
    description: 'Orden limpio sin solape',
    is3d: false,
    builder: buildGrid,
    preview: props => <MiniBoxes {...props} pattern='grid' />
  },
  {
    key: 'stagger',
    title: 'Escalonado',
    description: 'Fila con offset vertical',
    is3d: false,
    builder: buildStagger,
    preview: props => <MiniBoxes {...props} pattern='stagger' />
  },
  {
    key: 'stack',
    title: 'Apilado',
    description: 'Solape hacia abajo-derecha',
    is3d: false,
    builder: buildStack,
    preview: props => <MiniBoxes {...props} pattern='stack' />
  },
  {
    key: 'stack-balanced',
    title: 'Apilado suave',
    description: 'Solape equilibrado',
    is3d: false,
    builder: buildStackBalanced,
    preview: props => <MiniBoxes {...props} pattern='stack' />
  },
  {
    key: 'fan',
    title: 'Abanico',
    description: 'Rotación en abanico',
    is3d: false,
    builder: buildFan,
    preview: props => <MiniBoxes {...props} pattern='fan' />
  },
  {
    key: 'fan-tilt',
    title: 'Abanico inclinado',
    description: 'Ángulos irregulares',
    is3d: false,
    builder: buildFanTilt,
    preview: props => <MiniBoxes {...props} pattern='fan' />
  },
  {
    key: 'diagonal',
    title: 'Diagonal',
    description: 'Esquinas opuestas',
    is3d: false,
    builder: buildDiagonal,
    preview: props => <MiniBoxes {...props} pattern='diagonal' />
  },
  {
    key: 'perspective',
    title: 'Perspectiva',
    description: 'Inclinación 3D',
    is3d: true,
    builder: buildPerspective,
    preview: props => <MiniBoxes {...props} pattern='fan' />
  },
  {
    key: 'column',
    title: 'Columna',
    description: 'Apilado vertical centrado',
    is3d: false,
    builder: buildColumn,
    preview: props => <MiniBoxes {...props} pattern='column' />
  },
  {
    key: 'orbit',
    title: 'Órbita',
    description: 'Disposición circular 3D',
    is3d: true,
    builder: buildOrbit,
    preview: props => <MiniBoxes {...props} pattern='orbit' />
  }
]

export const SLOT_POSITION_LIST: SlotPositionEntry[] = FAMILIES.flatMap(family =>
  COUNTS.map(count => ({
    id: `${family.key}-${count}`,
    title: family.title,
    description: family.description,
    count,
    is3d: family.is3d,
    builder: family.builder,
    preview: family.preview
  }))
)

export const SLOT_POSITIONS = Object.fromEntries(
  SLOT_POSITION_LIST.map(entry => [entry.id, entry])
) as Record<string, SlotPositionEntry>

export type SlotPositionId = string

export const DEFAULT_POSITION_ID = 'grid-1'

export const positionsForCount = (count: number) =>
  SLOT_POSITION_LIST.filter(entry => entry.count === count)

export const getPositionEntry = (positionId: string, count: number): SlotPositionEntry => {
  const exact = SLOT_POSITIONS[positionId]
  if (exact && exact.count === count) return exact
  const family = positionId.replace(/-\d+$/, '')
  const familyMatch = SLOT_POSITIONS[`${family}-${count}`]
  if (familyMatch) return familyMatch
  return SLOT_POSITIONS[`grid-${count}`] ?? SLOT_POSITION_LIST[0]
}

export const defaultPositionIdForCount = (count: number) => `grid-${count}`
