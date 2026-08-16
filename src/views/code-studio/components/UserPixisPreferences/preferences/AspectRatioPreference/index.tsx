'use client'

import SizeController from '@common/components/SizeController'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import {
  ASPECT_DEFAULT,
  ASPECT_FREE,
  ASPECT_PRESETS,
  heightFromWidth,
  isAspectLocked,
  isAspectSelected,
  parseAspect
} from '../../utils/aspectRatio'
import { getDefaultState, getField } from '@views/code-studio/utils/preferences'
import { type FC } from 'react'

import { PreferenceField } from '@views/code-studio/components/preferences/PreferenceField'

const RatioTile: FC<{
  label: string
  selected: boolean
  ratio?: string
  free?: boolean
  onSelect: () => void
}> = ({ label, selected, ratio = '1:1', free = false, onSelect }) => {
  const parsed = parseAspect(ratio) ?? [1, 1]
  const landscape = parsed[0] >= parsed[1]

  return (
    <button
      type='button'
      aria-pressed={selected}
      aria-label={`Proporción ${label}`}
      onClick={onSelect}
      className='flex min-w-0 flex-col items-center gap-1'
    >
      <div className={cn('grid h-9 w-full place-content-center', chromeTile(selected))}>
        {free ? (
          <span className='border-foreground/45 size-[18px] rounded-[2px] border border-dashed' />
        ) : (
          <div
            className={cn('rounded-[2px]', selected ? 'bg-foreground/70' : 'bg-foreground/45')}
            style={{
              aspectRatio: `${parsed[0]} / ${parsed[1]}`,
              width: landscape ? '22px' : undefined,
              height: landscape ? undefined : '22px'
            }}
          />
        )}
      </div>
      <Text.caption className='text-center'>{label}</Text.caption>
    </button>
  )
}

const AspectRatioPreference: FC = () => {
  const field = getField('aspectRatio')
  const pixis = usePixisPreferencesStore(s => s.pixis)
  const setPixis = usePixisPreferencesStore(s => s.setPixis)
  const patchPixis = usePixisPreferencesStore(s => s.patchPixis)
  const defaults = getDefaultState().pixis

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
      return
    }

    const height = heightFromWidth(pixis.containerWidth, ratio)
    if (height != null) {
      patchPixis({ aspectRatio: ratio, containerWidth: pixis.containerWidth, containerHeight: height })
      return
    }

    setPixis('aspectRatio', ratio)
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
      <div className='flex w-full flex-col gap-3'>
        <div className='grid w-full grid-cols-3 gap-2'>
          <RatioTile
            ratio={ASPECT_DEFAULT}
            label='Default'
            selected={pixis.aspectRatio === ASPECT_DEFAULT}
            onSelect={() => handleSelectAspect(ASPECT_DEFAULT)}
          />
          <RatioTile
            free
            label='Libre'
            selected={pixis.aspectRatio === ASPECT_FREE}
            onSelect={() => handleSelectAspect(ASPECT_FREE)}
          />
          {ASPECT_PRESETS.map(preset => (
            <RatioTile
              key={preset.id}
              ratio={preset.id}
              label={preset.label}
              selected={isAspectSelected(pixis.aspectRatio, preset.id)}
              onSelect={() => handleSelectAspect(preset.id)}
            />
          ))}
        </div>

        <SizeController
          width={pixis.containerWidth}
          height={pixis.containerHeight}
          setWidth={width => setPixis('containerWidth', width)}
          setHeight={height => setPixis('containerHeight', height)}
          forceLockAspect={isAspectLocked(pixis.aspectRatio)}
        />
      </div>
    </PreferenceField>
  )
}

export default AspectRatioPreference
