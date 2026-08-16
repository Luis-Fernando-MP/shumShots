'use client'

import { LIGHT_PRESETS, type LightType } from '@views/image-studio/Popups/common/presets/light'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import EffectPresetGrid from '@views/image-studio/Popups/common/components/EffectPresetGrid'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

const selectActiveLight = (s: { layers: CanvasLightLayer[]; activeId: string }) =>
  s.layers.find(layer => layer.id === s.activeId) ?? s.layers[0] ?? defaultLightLayer(1)

const PresetsBuilder: FC = () => {
  const light = useCanvasLightStore(selectActiveLight)
  const applyLightPreset = useCanvasLightStore(s => s.applyLightPreset)

  return (
    <SectionBlock title='Estilos' level={2} description='Elige un preset y afina con el foco y los ajustes.'>
      <EffectPresetGrid
        presets={LIGHT_PRESETS}
        activeType={light.type}
        onSelect={type => applyLightPreset(type as LightType)}
        tone='light'
      />
    </SectionBlock>
  )
}

export default PresetsBuilder
