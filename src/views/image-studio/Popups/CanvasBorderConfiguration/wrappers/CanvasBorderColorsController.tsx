'use client'

import ColorsController from '@/shared/components/ColorsController'
import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const CanvasBorderColorsController: FC = () => {
  const color = useBackgroundBorderStore(s => s.color)
  const type = useBackgroundBorderStore(s => s.type)
  const setColor = useBackgroundBorderStore(s => s.setColor)
  const setType = useBackgroundBorderStore(s => s.setType)

  return (
    <SectionBlock
      title='Color del borde'
      description='Paleta rápida o color personalizado. Respeta el estilo activo.'
    >
      <ColorsController
        background={color}
        setBackground={value => {
          setColor(value)
          if (type === 'none') setType('solid')
        }}
      />
    </SectionBlock>
  )
}

export default CanvasBorderColorsController
