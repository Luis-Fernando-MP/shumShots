'use client'

import SizeController from '@common/components/SizeController'
import { cn } from '@common/utils/cn'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import PresetCard from '@views/image-studio/Popups/common/components/PresetCard'
import type { FC } from 'react'

export type SizePreset = {
  id: string
  label: string
  width: number
  height: number
}

type Props = {
  width: number
  height: number
  setWidth: (width: number) => void
  setHeight: (height: number) => void
  setSize: (width: number, height: number) => void
  presets: readonly SizePreset[]
  title?: string
  description?: string
  level?: 1 | 2
  disabled?: boolean
  disabledHint?: string
  embedded?: boolean
  forceLockAspect?: boolean
}

const AspectThumb: FC<{ width: number; height: number; active: boolean }> = ({
  width,
  height,
  active
}) => {
  const ratio = width / height
  const max = 40
  const boxW = ratio >= 1 ? max : Math.max(14, Math.round(max * ratio))
  const boxH = ratio >= 1 ? Math.max(14, Math.round(max / ratio)) : max

  return (
    <div className='flex h-11 w-full items-center justify-center'>
      <div
        className={cn('rounded-[2px] transition-colors', active ? 'bg-primary' : 'bg-foreground/30')}
        style={{ width: boxW, height: boxH }}
      />
    </div>
  )
}

const SizePresetsSection: FC<Props> = ({
  width,
  height,
  setWidth,
  setHeight,
  setSize,
  presets,
  title = 'Tamaño',
  description,
  level = 1,
  disabled = false,
  disabledHint,
  embedded = false,
  forceLockAspect = false
}) => {
  const body = disabled ? (
    <p className='text-muted-foreground text-xs leading-relaxed'>
      {disabledHint ?? 'No disponible con el estado actual.'}
    </p>
  ) : (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-4 gap-1.5'>
        {presets.map(item => {
          const active = width === item.width && height === item.height
          return (
            <PresetCard
              key={item.id}
              active={active}
              onClick={() => setSize(item.width, item.height)}
              className='gap-0.5 px-1 py-1.5'
            >
              <AspectThumb width={item.width} height={item.height} active={active} />
              <span className='text-[10px] font-medium leading-tight'>{item.label}</span>
            </PresetCard>
          )
        })}
      </div>

      <SizeController
        width={width}
        height={height}
        setWidth={setWidth}
        setHeight={setHeight}
        forceLockAspect={forceLockAspect}
      />
    </div>
  )

  if (embedded) return body

  return (
    <SectionBlock title={title} description={description} level={level}>
      {body}
    </SectionBlock>
  )
}

export default SizePresetsSection
