'use client'

import ColorsController from '@common/components/ColorsController'
import { extractColor } from '@common/components/extractColor'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import LightAdjustments from '@views/image-studio/Popups/common/components/LightAdjustments'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { Fragment, type FC } from 'react'

const selectActiveLight = (s: { layers: CanvasLightLayer[]; activeId: string }) =>
  s.layers.find(layer => layer.id === s.activeId) ?? s.layers[0] ?? defaultLightLayer(1)

const AdjustmentsBuilder: FC = () => {
  const light = useCanvasLightStore(selectActiveLight)
  const updateLight = useCanvasLightStore(s => s.updateLight)

  if (!light || light.type === 'none') return null

  return (
    <Fragment>
      <SectionBlock title='Ajustes' level={2} description='Intensidad y qué tan amplia se siente la luz.'>
        <LightAdjustments
          opacity={light.opacity}
          size={light.size}
          onOpacity={opacity => updateLight({ opacity })}
          onSize={size => updateLight({ size })}
        />
      </SectionBlock>

      <SectionBlock title='Color' level={2}>
        <ColorsController
          background={light.color}
          setBackground={bg => {
            const parsed = extractColor(bg)
            if (!parsed) return
            updateLight({ color: `${parsed.r},${parsed.g},${parsed.b}` })
          }}
        />
      </SectionBlock>
    </Fragment>
  )
}

export default AdjustmentsBuilder
