'use client'

import SliderControl from '@/shared/components/SliderControl'
import ColorsController from '@/shared/components/ColorsController'
import { extractColor } from '@/shared/components/extractColor'
import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { useActiveLayerPreview } from '@views/image-studio/hooks/useShadowVisualStyles'
import useShadowStore, {
  LIGHT_PRESETS,
  SHADOW_PRESETS,
  getActiveLight,
  getActiveShadow,
  type LightType,
  type ShadowType
} from '@views/image-studio/store/shadow/shadow.store'
import { PlusIcon, XIcon } from 'lucide-react'
import type { FC, MouseEvent } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'
import FocusPad from './FocusPad'
import TargetSlotsPicker from './TargetSlotsPicker'

type Kind = 'shadow' | 'light'

const LayerTabs: FC<{ kind: Kind }> = ({ kind }) => {
  const layers = useShadowStore(s => (kind === 'shadow' ? s.shadowLayers : s.lightLayers))
  const activeId = useShadowStore(s => (kind === 'shadow' ? s.activeShadowId : s.activeLightId))
  const setActive = useShadowStore(s => (kind === 'shadow' ? s.setActiveShadow : s.setActiveLight))
  const addLayer = useShadowStore(s => (kind === 'shadow' ? s.addShadowLayer : s.addLightLayer))
  const removeLayer = useShadowStore(s =>
    kind === 'shadow' ? s.removeShadowLayer : s.removeLightLayer
  )

  const remove = (event: MouseEvent, id: string) => {
    event.stopPropagation()
    removeLayer(id)
  }

  return (
    <div className='scrollbar-hidden flex items-center gap-1.5 overflow-x-auto'>
      {layers.map((layer, index) => {
        const active = layer.id === activeId
        return (
          <Button
            key={layer.id}
            type='button'
            variant={active ? 'secondary' : 'outline'}
            size='sm'
            className={cn('h-7 shrink-0 gap-1 px-2.5 text-xs', active && 'border-primary')}
            onClick={() => setActive(layer.id)}
          >
            {index + 1}
            {layers.length > 1 && (
              <span
                role='button'
                tabIndex={-1}
                aria-label='Quitar capa'
                className='text-muted-foreground hover:text-foreground -mr-0.5 rounded-sm'
                onClick={event => remove(event, layer.id)}
              >
                <XIcon className='size-3' />
              </span>
            )}
          </Button>
        )
      })}
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='text-muted-foreground h-7 shrink-0 px-2'
        aria-label={kind === 'shadow' ? 'Nueva sombra' : 'Nueva luz'}
        onClick={addLayer}
      >
        <PlusIcon className='size-3.5' />
      </Button>
    </div>
  )
}

const LayerPresets: FC<{ kind: Kind }> = ({ kind }) => {
  const shadow = useShadowStore(getActiveShadow)
  const light = useShadowStore(getActiveLight)
  const applyShadowPreset = useShadowStore(s => s.applyShadowPreset)
  const applyLightPreset = useShadowStore(s => s.applyLightPreset)
  const presets = kind === 'shadow' ? SHADOW_PRESETS : LIGHT_PRESETS
  const activeType = kind === 'shadow' ? shadow.type : light.type

  return (
    <SectionBlock title='Estilos' level={2} description='Elige un preset y afina con el foco y los ajustes.'>
      <div className='grid grid-cols-3 gap-1.5'>
        {presets.map(preset => {
          const active = activeType === preset.type
          return (
            <Button
              key={preset.type}
              type='button'
              variant={active ? 'secondary' : 'outline'}
              size='sm'
              aria-pressed={active}
              onClick={() =>
                kind === 'shadow'
                  ? applyShadowPreset(preset.type as ShadowType)
                  : applyLightPreset(preset.type as LightType)
              }
              className={cn(
                'flex h-auto flex-col items-center gap-1.5 px-1 py-2',
                active && 'border-primary'
              )}
            >
              <div className='bg-muted/40 flex h-10 w-full items-center justify-center rounded-sm'>
                <div
                  className={cn(
                    'size-5 rounded-sm',
                    preset.type === 'none' ? 'bg-muted-foreground/25' : 'bg-primary/40'
                  )}
                  style={{ boxShadow: preset.type === 'none' ? 'none' : preset.preview }}
                />
              </div>
              <span
                className={cn(
                  'text-xs leading-none font-medium',
                  active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {preset.label}
              </span>
            </Button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

const LayerAdjustments: FC<{ kind: Kind }> = ({ kind }) => {
  const { shadow, light } = useActiveLayerPreview()
  const updateActiveShadow = useShadowStore(s => s.updateActiveShadow)
  const updateActiveLight = useShadowStore(s => s.updateActiveLight)

  if (kind === 'shadow') {
    if (!shadow || shadow.type === 'none') return null
    return (
      <SectionBlock title='Ajustes' level={2} description='Intensidad y qué tan difusa se siente la sombra.'>
        <div className='flex flex-col gap-3'>
          <SliderControl
            label='Intensidad'
            onChangeRange={v => updateActiveShadow({ opacity: v / 100 })}
            value={Math.round(shadow.opacity * 100)}
            step={1}
            min={0}
            max={100}
            displayValue={`${Math.round(shadow.opacity * 100)}%`}
          />
          <SliderControl
            label='Difuminado'
            onChangeRange={blur => updateActiveShadow({ blur })}
            value={Math.round(shadow.blur)}
            step={1}
            min={0}
            max={140}
            displayValue={`${Math.round(shadow.blur)}`}
          />
        </div>
      </SectionBlock>
    )
  }

  if (!light || light.type === 'none') return null
  return (
    <SectionBlock title='Ajustes' level={2} description='Intensidad y qué tan amplia se siente la luz.'>
      <div className='flex flex-col gap-3'>
        <SliderControl
          label='Intensidad'
          onChangeRange={v => updateActiveLight({ opacity: v / 100 })}
          value={Math.round(light.opacity * 100)}
          step={1}
          min={0}
          max={100}
          displayValue={`${Math.round(light.opacity * 100)}%`}
        />
        <SliderControl
          label='Alcance'
          onChangeRange={size => updateActiveLight({ size })}
          value={Math.round(light.size)}
          step={1}
          min={20}
          max={100}
          displayValue={`${Math.round(light.size)}`}
        />
      </div>
    </SectionBlock>
  )
}

const LayerColor: FC<{ kind: Kind }> = ({ kind }) => {
  const { shadow, light } = useActiveLayerPreview()
  const updateActiveShadow = useShadowStore(s => s.updateActiveShadow)
  const updateActiveLight = useShadowStore(s => s.updateActiveLight)
  const layer = kind === 'shadow' ? shadow : light
  if (!layer || layer.type === 'none') return null

  return (
    <SectionBlock title='Color' level={2}>
      <ColorsController
        background={layer.color}
        setBackground={bg => {
          const parsed = extractColor(bg)
          if (!parsed) return
          const color = `${parsed.r},${parsed.g},${parsed.b}`
          if (kind === 'shadow') updateActiveShadow({ color })
          else updateActiveLight({ color })
        }}
      />
    </SectionBlock>
  )
}

const LayerPanel: FC<{ kind: Kind }> = ({ kind }) => {
  const shadow = useShadowStore(getActiveShadow)
  const light = useShadowStore(getActiveLight)
  const setShadowTargets = useShadowStore(s => s.setShadowTargets)
  const setLightTargets = useShadowStore(s => s.setLightTargets)
  const layer = kind === 'shadow' ? shadow : light
  const onTargets = kind === 'shadow' ? setShadowTargets : setLightTargets
  const title = kind === 'shadow' ? 'Sombra' : 'Luz'

  return (
    <section className='gap-grid-lg flex flex-col'>
      <SectionBlock title={title} description='Capas, destino, estilo, foco e intensidad.'>
        <div className='flex flex-col gap-2.5'>
          <LayerTabs kind={kind} />
          {layer && <TargetSlotsPicker targetIds={layer.targetIds} onChange={onTargets} />}
        </div>
      </SectionBlock>
      <LayerPresets kind={kind} />
      <FocusPad kind={kind} />
      <LayerAdjustments kind={kind} />
      <LayerColor kind={kind} />
    </section>
  )
}

export default LayerPanel
