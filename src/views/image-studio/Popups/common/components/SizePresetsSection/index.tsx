'use client'

import SizeController from '@common/components/SizeController'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
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

const FormatStage: FC<{ width: number; height: number; label: string; active: boolean }> = ({
  width,
  height,
  label,
  active
}) => {
  const landscape = width >= height

  return (
    <div className='flex flex-col items-center gap-1'>
      <div
        className={cn(
          'grid h-9 w-full place-content-center rounded-[8px]',
          active ? 'bg-primary/15' : 'bg-muted hover:bg-muted/80'
        )}
      >
        <div
          className={cn('rounded-[2px]', active ? 'bg-primary' : 'bg-foreground/50')}
          style={{
            aspectRatio: `${width} / ${height}`,
            width: landscape ? '22px' : undefined,
            height: landscape ? undefined : '22px'
          }}
        />
      </div>
      <Text.caption className={cn('text-center', active && 'text-primary')}>{label}</Text.caption>
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
    <Text.caption>{disabledHint ?? 'No disponible con el estado actual.'}</Text.caption>
  ) : (
    <div className='flex flex-col gap-3'>
      <div className='grid grid-cols-3 gap-1.5'>
        {presets.map(item => (
          <button key={item.id} type='button' onClick={() => setSize(item.width, item.height)}>
            <FormatStage
              width={item.width}
              height={item.height}
              label={item.label}
              active={width === item.width && height === item.height}
            />
          </button>
        ))}
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
