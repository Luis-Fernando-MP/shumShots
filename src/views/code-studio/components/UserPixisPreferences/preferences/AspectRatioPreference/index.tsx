'use client'

import Button from '@common/components/Button'
import { Input } from '@common/components/Input'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import {
  ASPECT_DEFAULT,
  ASPECT_FREE,
  ASPECT_PRESETS,
  heightFromWidth,
  isAspectSelected,
  parseAspect,
  resolveAspectSelection,
  simplifyAspect
} from '../../utils/aspectRatio'
import { getDefaultState, getField } from '@views/code-studio/utils/preferences'
import { type FC, useState } from 'react'

import { PreferenceField } from '@views/code-studio/components/preferences/PreferenceField'

const AspectRatioButton: FC<{
  ratio?: string
  label: string
  selected: boolean
  free?: boolean
  onSelect: () => void
}> = ({ ratio = '1:1', label, selected, free = false, onSelect }) => {
  const parsed = parseAspect(ratio)
  const aspectCss = parsed ? `${parsed[0]} / ${parsed[1]}` : '1 / 1'
  const landscape = parsed ? parsed[0] >= parsed[1] : true

  return (
    <Button
      type='button'
      size='sm'
      variant='soft'
      isSelected={selected}
      aria-pressed={selected}
      aria-label={`Aspect ratio ${label}`}
      onClick={onSelect}
      className='h-auto w-full flex-col gap-1.5 rounded-[12px] px-1.5 py-2'
    >
      <span
        className={cn(
          'border-border/60 bg-muted/40 flex size-10 items-center justify-center rounded-sm border',
          selected && 'border-primary-foreground/40'
        )}
      >
        {free ? (
          <span
            className={cn(
              'border-border size-[70%] rounded-[2px] border border-dashed',
              selected && 'border-primary-foreground/70'
            )}
          />
        ) : (
          <span
            className={cn(
              'border-primary/50 bg-primary/35 max-h-[78%] max-w-[78%] rounded-[2px] border',
              selected && 'border-primary-foreground/50 bg-primary-foreground/35'
            )}
            style={{
              aspectRatio: aspectCss,
              width: landscape ? '78%' : undefined,
              height: landscape ? undefined : '78%'
            }}
          />
        )}
      </span>
      <Text.emphasis className={cn('leading-none', selected && 'text-semantic-primary')}>{label}</Text.emphasis>
    </Button>
  )
}

const AspectRatioPreference: FC = () => {
  const field = getField('aspectRatio')
  const pixis = usePixisPreferencesStore(s => s.pixis)
  const setPixis = usePixisPreferencesStore(s => s.setPixis)
  const patchPixis = usePixisPreferencesStore(s => s.patchPixis)
  const defaults = getDefaultState().pixis

  const parsedAspect = parseAspect(pixis.aspectRatio)
  const [customW, setCustomW] = useState(String(parsedAspect?.[0] ?? 16))
  const [customH, setCustomH] = useState(String(parsedAspect?.[1] ?? 9))

  const handleSelectAspect = (ratio: string) => {
    if (ratio === ASPECT_FREE) {
      setPixis('aspectRatio', ratio)
      return
    }

    if (ratio === ASPECT_DEFAULT) {
      patchPixis({
        aspectRatio: ratio,
        containerWidth: defaults.containerWidth,
        containerHeight: defaults.containerHeight
      })
      setCustomW('3')
      setCustomH('2')
      return
    }

    const parsed = parseAspect(ratio)
    if (parsed) {
      setCustomW(String(parsed[0]))
      setCustomH(String(parsed[1]))
    }

    const height = heightFromWidth(pixis.containerWidth, ratio)
    if (height != null) {
      patchPixis({ aspectRatio: ratio, containerWidth: pixis.containerWidth, containerHeight: height })
      return
    }

    setPixis('aspectRatio', ratio)
  }

  const handleApplyCustomAspect = () => {
    const w = Number(customW)
    const h = Number(customH)
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return
    const [sw, sh] = simplifyAspect(w, h)
    setCustomW(String(sw))
    setCustomH(String(sh))
    handleSelectAspect(resolveAspectSelection(w, h))
  }

  return (
    <PreferenceField
      title={field.title}
      subtitle={field.subtitle}
      description={field.description}
      example={field.example}
      note={field.note}
      keywords='aspect ratio proporcion ancho alto default free'
    >
      <div className='flex w-full flex-col gap-2.5'>
        <div className='grid w-full grid-cols-2 gap-1.5'>
          <AspectRatioButton
            ratio={ASPECT_DEFAULT}
            label='Default'
            selected={pixis.aspectRatio === ASPECT_DEFAULT}
            onSelect={() => handleSelectAspect(ASPECT_DEFAULT)}
          />
          <AspectRatioButton
            free
            label='Free'
            selected={pixis.aspectRatio === ASPECT_FREE}
            onSelect={() => handleSelectAspect(ASPECT_FREE)}
          />
          {ASPECT_PRESETS.map(preset => (
            <AspectRatioButton
              key={preset.id}
              ratio={preset.id}
              label={preset.label}
              selected={isAspectSelected(pixis.aspectRatio, preset.id)}
              onSelect={() => handleSelectAspect(preset.id)}
            />
          ))}
        </div>

        {pixis.aspectRatio === ASPECT_FREE && (
          <div className='flex flex-wrap items-center gap-1.5'>
            <Input
              type='number'
              size='sm'
              variant='outline'
              value={customW}
              min={1}
              max={99}
              step={1}
              aria-label='Aspecto ancho'
              onChange={e => setCustomW(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleApplyCustomAspect()
              }}
              containerClassName='w-[4.5rem]'
            />
            <Text.caption>/</Text.caption>
            <Input
              type='number'
              size='sm'
              variant='outline'
              value={customH}
              min={1}
              max={99}
              step={1}
              aria-label='Aspecto alto'
              onChange={e => setCustomH(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleApplyCustomAspect()
              }}
              containerClassName='w-[4.5rem]'
            />
            <Button type='button' size='sm' variant='outline' onClick={handleApplyCustomAspect}>
              Aplicar
            </Button>
          </div>
        )}
      </div>
    </PreferenceField>
  )
}

export default AspectRatioPreference
