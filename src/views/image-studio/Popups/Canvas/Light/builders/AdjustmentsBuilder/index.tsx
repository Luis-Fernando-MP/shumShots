'use client'

import SliderControl from '@/shared/components/SliderControl'
import ColorsController from '@/shared/components/ColorsController'
import { extractColor } from '@/shared/components/extractColor'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
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
        <div className='flex flex-col gap-3'>
          <SliderControl
            label='Intensidad'
            onChangeRange={v => updateLight({ opacity: v / 100 })}
            value={Math.round(light.opacity * 100)}
            step={1}
            min={0}
            max={100}
            displayValue={`${Math.round(light.opacity * 100)}%`}
          />
          <SliderControl
            label='Alcance'
            onChangeRange={size => updateLight({ size })}
            value={Math.round(light.size)}
            step={1}
            min={20}
            max={100}
            displayValue={`${Math.round(light.size)}`}
          />
        </div>
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
