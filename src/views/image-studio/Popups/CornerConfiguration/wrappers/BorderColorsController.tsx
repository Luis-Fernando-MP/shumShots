'use client'

import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import ColorsController from '@/shared/components/ColorsController'
import Typography from '@common/ui/Typography'
import type { FC } from 'react'

const BorderColorsController: FC = () => {
  const color = UseImagesBorderStore(s => s.color)
  const setColor = UseImagesBorderStore(s => s.setColor)
  const setType = UseImagesBorderStore(s => s.setType)

  const handleChangeColor = (bg: string) => {
    setColor(bg)
    setType('solid')
  }

  return (
    <Typography.Block title='Colores' className='gap-grid-lg flex flex-col'>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </Typography.Block>
  )
}

export default BorderColorsController
