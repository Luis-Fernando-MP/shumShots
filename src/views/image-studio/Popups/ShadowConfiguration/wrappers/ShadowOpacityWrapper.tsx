'use client'

import SliderControl from '@/shared/components/SliderControl'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const ShadowOpacityWrapper: FC = () => {
  const type = useShadowStore(s => s.type)
  const opacity = useShadowStore(s => s.opacity)
  const setOpacity = useShadowStore(s => s.setOpacity)

  if (type === 'none') return null

  return (
    <SectionBlock title='Opacidad' description='Ajusta la intensidad de la sombra.'>
      <SliderControl onChangeRange={v => setOpacity(v / 100)} value={Math.round(opacity * 100)} step={5} width={200} />
    </SectionBlock>
  )
}

export default ShadowOpacityWrapper
