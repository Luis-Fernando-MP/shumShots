'use client'

import { cn } from '@common/utils/cn'
import type { BorderConfigurationState, BorderType } from '@views/image-studio/store/border/createBorderStore'
import type { BorderFinish } from '@views/image-studio/utils/borderFinish'
import {
  resolveBorderColor,
  resolveBorderFinishShadow
} from '@views/image-studio/utils/borderFinish'
import { CircleOffIcon } from 'lucide-react'
import type { CSSProperties, FC } from 'react'

export type BorderStylePreset = {
  id: string
  label: string
  type: BorderType
  finish: BorderFinish
  color: string | null
  size: number
}

export const BORDER_STYLE_PRESETS: BorderStylePreset[] = [
  { id: 'clean', label: 'Limpio', type: 'none', finish: 'solid', color: null, size: 0 },
  {
    id: 'white-soft',
    label: 'Blanco transparente',
    type: 'solid',
    finish: 'soft',
    color: 'rgba(255, 255, 255, 1)',
    size: 4
  },
  {
    id: 'dark-soft',
    label: 'Negro transparente',
    type: 'solid',
    finish: 'soft',
    color: 'rgba(0, 0, 0, 1)',
    size: 4
  },
  {
    id: 'outline',
    label: 'Outline',
    type: 'solid',
    finish: 'soft-frame',
    color: 'rgba(255, 255, 255, 1)',
    size: 5
  },
  {
    id: 'white',
    label: 'Blanco',
    type: 'solid',
    finish: 'solid',
    color: 'rgba(255, 255, 255, 1)',
    size: 8
  },
  {
    id: 'black',
    label: 'Negro',
    type: 'solid',
    finish: 'solid',
    color: 'rgba(0, 0, 0, 1)',
    size: 7
  }
]

const CornerPreview: FC<{
  color: string | null
  size: number
  finish: BorderFinish
  empty?: boolean
}> = ({ color, size, finish, empty }) => {
  if (empty) {
    return (
      <div className='bg-muted relative flex h-9 w-full items-center justify-center overflow-hidden rounded-md'>
        <CircleOffIcon className='text-muted-foreground size-4' />
      </div>
    )
  }

  const stroke = Math.max(2, Math.min(6, size))
  const cornerStyle: CSSProperties = {
    border: `${stroke}px solid ${resolveBorderColor(color ?? 'transparent', finish)}`,
    boxShadow: resolveBorderFinishShadow(finish)
  }

  return (
    <div className='bg-muted relative h-9 w-full overflow-hidden rounded-md'>
      <div className='pointer-events-none absolute inset-x-1 bottom-1 h-3 rounded-full bg-linear-to-r from-cyan-400 via-fuchsia-500 to-violet-500 blur-md' />
      <div className='bg-card absolute -top-3 -right-3 size-[78%] rounded-[12px]' style={cornerStyle} />
    </div>
  )
}

type Props = {
  borderState: BorderConfigurationState
}

const BorderStylePresets: FC<Props> = ({ borderState }) => {
  const { type, finish, color, size, setType, setFinish, setColor, setSize } = borderState

  const isActive = (preset: BorderStylePreset) => {
    if (preset.type === 'none') return type === 'none'
    return (
      type === preset.type &&
      finish === preset.finish &&
      color === preset.color &&
      Math.abs(size - preset.size) <= 1
    )
  }

  const apply = (preset: BorderStylePreset) => {
    if (preset.type === 'none') {
      setType('none')
      return
    }
    setFinish(preset.finish)
    setType(preset.type)
    if (preset.color) setColor(preset.color)
    setSize(preset.size)
  }

  return (
    <div className='grid grid-cols-3 gap-1.5'>
      {BORDER_STYLE_PRESETS.map(preset => {
        const active = isActive(preset)
        return (
          <button
            key={preset.id}
            type='button'
            onClick={() => apply(preset)}
            className={cn(
              'flex flex-col gap-0.5 rounded-md p-1 text-left transition-colors',
              active ? 'bg-secondary ring-primary/40 ring-1' : 'hover:bg-muted/50'
            )}
          >
            <CornerPreview
              color={preset.color}
              size={preset.size}
              finish={preset.finish}
              empty={preset.type === 'none'}
            />
            <span className='text-muted-foreground px-0.5 text-center text-[10px] leading-tight font-medium'>
              {preset.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default BorderStylePresets
