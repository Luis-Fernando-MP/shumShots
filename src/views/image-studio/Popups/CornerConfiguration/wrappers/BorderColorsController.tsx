'use client'

import ColorsController from '@/shared/components/ColorsController'
import { useActiveTabId } from '@views/image-studio/shared/components/tabs'
import { useCornerBorderAdapter } from '@views/image-studio/store/corner/adapters'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const BorderColorsController: FC = () => {
  const tabId = useActiveTabId()
  const { color, type, setColor, setType } = useCornerBorderAdapter(tabId)

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

export default BorderColorsController
