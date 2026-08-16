'use client'

import SliderControl from '@common/components/SliderControl'
import ColorsController from '@common/components/ColorsController'
import { extractColor } from '@common/components/extractColor'
import { LIGHT_PRESETS, type LightType } from '@views/image-studio/Popups/common/presets/light'
import { SHADOW_PRESETS, type ShadowType } from '@views/image-studio/Popups/CanvasImages/ShadowLight/presets/shadow'
import { useActiveLayerPreview } from '@views/image-studio/canvas/PictureCanvas/hooks/useShadowVisualStyles'
import EffectPresetGrid from '@views/image-studio/Popups/common/components/EffectPresetGrid'
import LightAdjustments from '@views/image-studio/Popups/common/components/LightAdjustments'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import TabBar from '@views/image-studio/Popups/common/components/tabs/TabBar'
import useShadowStore, {
  selectTabConfig
} from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import type { FC } from 'react'

import FocusPad from '@views/image-studio/Popups/CanvasImages/ShadowLight/shared/FocusPad'

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
      labelPrefix={kind === 'shadow' ? 'Sombra' : 'Luz'}
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
      <EffectPresetGrid
        presets={presets}
        activeType={activeType}
        onSelect={type =>
          kind === 'shadow'
            ? applyShadowPreset(tabId, type as ShadowType)
            : applyLightPreset(tabId, type as LightType)
        }
        tone={kind === 'light' ? 'light' : 'shadow'}
      />
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
            unit='%'
          />
          <SliderControl
            label='Difuminado'
            onChangeRange={blur => updateActiveShadow(tabId, { blur })}
            value={Math.round(shadow.blur)}
            step={1}
            min={0}
            max={140}
            unit='px'
          />
        </div>
      </SectionBlock>
    )
  }

  if (!light || light.type === 'none') return null
  return (
    <SectionBlock title='Ajustes' level={2} description='Intensidad y qué tan amplia se siente la luz.'>
      <LightAdjustments
        opacity={light.opacity}
        size={light.size}
        onOpacity={opacity => updateActiveLight(tabId, { opacity })}
        onSize={size => updateActiveLight(tabId, { size })}
      />
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
    <section className='flex flex-col gap-6'>
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
