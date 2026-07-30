'use client'

import ColorsController from '@/shared/components/ColorsController'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { BorderConfigurationState } from '@views/image-studio/Popups/common/components/createBorderStore'
import type { FC } from 'react'

type Props = {
  color: string
  type: BorderConfigurationState['type']
  setColor: (color: string) => void
  setType: (type: BorderConfigurationState['type']) => void
  title?: string
  description?: string
}

const BorderColor: FC<Props> = ({
  color,
  type,
  setColor,
  setType,
  title = 'Color del borde',
  description = 'Paleta rápida o color personalizado. Respeta el estilo activo.'
}) => (
  <SectionBlock title={title} description={description}>
    <ColorsController
      background={color}
      setBackground={value => {
        setColor(value)
        if (type === 'none') setType('solid')
      }}
    />
  </SectionBlock>
)

export default BorderColor
