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
  const ratio = width / height
  const landscape = ratio >= 1

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-[12px] border px-2 py-2',
        active ? 'border-primary bg-primary/10' : 'border-border/60 bg-muted/40 hover:bg-muted/70'
      )}
    >
      <div className='bg-background/60 grid aspect-square w-full place-content-center rounded-[8px]'>
        <div
          className={cn('rounded-[3px]', active ? 'bg-primary' : 'bg-foreground/40')}
          style={{
            aspectRatio: ratio,
            width: landscape ? '72%' : undefined,
            height: landscape ? undefined : '72%'
          }}
        />
      </div>
      <Text.emphasis className={cn('text-center', !active && 'text-muted-foreground')}>{label}</Text.emphasis>
      <Text.caption className='tabular-nums'>
        {width}×{height}
      </Text.caption>
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
      <div className='grid grid-cols-2 gap-1.5'>
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
