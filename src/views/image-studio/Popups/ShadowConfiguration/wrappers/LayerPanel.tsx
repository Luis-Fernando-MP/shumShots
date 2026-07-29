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
  selectTabConfig,
  type LightType,
  type ShadowType
} from '@views/image-studio/Popups/ShadowConfiguration/store'
import TabBar from '@views/image-studio/shared/components/tabs/TabBar'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'
import FocusPad from './FocusPad'

type Kind = 'shadow' | 'light'

type PanelProps = { kind: Kind; tabId: string }

const LayerTabs: FC<PanelProps> = ({ kind, tabId }) => {
  const config = useShadowStore(selectTabConfig(tabId))
  const layers = kind === 'shadow' ? config.shadowLayers : config.lightLayers
  const activeId = kind === 'shadow' ? config.activeShadowId : config.activeLightId
  const setActive = useShadowStore(s => (kind === 'shadow' ? s.setActiveShadow : s.setActiveLight))
  const addLayer = useShadowStore(s => (kind === 'shadow' ? s.addShadowLayer : s.addLightLayer))
  const removeLayer = useShadowStore(s =>
    kind === 'shadow' ? s.removeShadowLayer : s.removeLightLayer
  )

  return (
    <TabBar
      items={layers}
      activeId={activeId}
      onSelect={id => setActive(tabId, id)}
      onAdd={() => addLayer(tabId)}
      onRemove={id => removeLayer(tabId, id)}
      addLabel={kind === 'shadow' ? 'Nueva sombra' : 'Nueva luz'}
    />
  )
}

const LayerPresets: FC<PanelProps> = ({ kind, tabId }) => {
  const { shadow, light } = useActiveLayerPreview(tabId)
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
                  ? applyShadowPreset(tabId, preset.type as ShadowType)
                  : applyLightPreset(tabId, preset.type as LightType)
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

const LayerAdjustments: FC<PanelProps> = ({ kind, tabId }) => {
  const { shadow, light } = useActiveLayerPreview(tabId)
  const updateActiveShadow = useShadowStore(s => s.updateActiveShadow)
  const updateActiveLight = useShadowStore(s => s.updateActiveLight)

  if (kind === 'shadow') {
    if (!shadow || shadow.type === 'none') return null
    return (
      <SectionBlock title='Ajustes' level={2} description='Intensidad y qué tan difusa se siente la sombra.'>
        <div className='flex flex-col gap-3'>
          <SliderControl
            label='Intensidad'
            onChangeRange={v => updateActiveShadow(tabId, { opacity: v / 100 })}
            value={Math.round(shadow.opacity * 100)}
            step={1}
            min={0}
            max={100}
            displayValue={`${Math.round(shadow.opacity * 100)}%`}
          />
          <SliderControl
            label='Difuminado'
            onChangeRange={blur => updateActiveShadow(tabId, { blur })}
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
          onChangeRange={v => updateActiveLight(tabId, { opacity: v / 100 })}
          value={Math.round(light.opacity * 100)}
          step={1}
          min={0}
          max={100}
          displayValue={`${Math.round(light.opacity * 100)}%`}
        />
        <SliderControl
          label='Alcance'
          onChangeRange={size => updateActiveLight(tabId, { size })}
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

const LayerColor: FC<PanelProps> = ({ kind, tabId }) => {
  const { shadow, light } = useActiveLayerPreview(tabId)
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
          if (kind === 'shadow') updateActiveShadow(tabId, { color })
          else updateActiveLight(tabId, { color })
        }}
      />
    </SectionBlock>
  )
}

const LayerPanel: FC<PanelProps> = ({ kind, tabId }) => {
  const title = kind === 'shadow' ? 'Sombra' : 'Luz'

  return (
    <section className='gap-grid-lg flex flex-col'>
      <SectionBlock title={title} description='Estilo, foco e intensidad para los destinos del tab.'>
        <LayerTabs kind={kind} tabId={tabId} />
      </SectionBlock>
      <LayerPresets kind={kind} tabId={tabId} />
      <FocusPad kind={kind} tabId={tabId} />
      <LayerAdjustments kind={kind} tabId={tabId} />
      <LayerColor kind={kind} tabId={tabId} />
    </section>
  )
}

export default LayerPanel
