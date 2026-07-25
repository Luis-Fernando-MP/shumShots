'use client'

import SliderControl from '@/shared/components/SliderControl'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const LightOpacityWrapper: FC = () => {
  const lightType = useShadowStore(s => s.lightType)
  const lightOpacity = useShadowStore(s => s.lightOpacity)
  const lightSize = useShadowStore(s => s.lightSize)
  const setLightOpacity = useShadowStore(s => s.setLightOpacity)
  const setLightSize = useShadowStore(s => s.setLightSize)

  if (lightType === 'none') return null

  return (
    <>
      <SectionBlock title='Intensidad' description='Fuerza de la luz sobre la imagen.'>
        <SliderControl
          onChangeRange={v => setLightOpacity(v / 100)}
          value={Math.round(lightOpacity * 100)}
          step={5}
          width={200}
        />
      </SectionBlock>
      <SectionBlock title='Alcance' description='Qué tan amplia es la mancha de luz.'>
        <SliderControl onChangeRange={setLightSize} value={Math.round(lightSize)} min={20} max={100} step={2} width={200} />
      </SectionBlock>
    </>
  )
}

export default LightOpacityWrapper
