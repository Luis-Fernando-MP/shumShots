import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import ColorsController from '@/shared/components/ColorsController'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BorderColorsController: FC = () => {
  const { color, setColor, setType } = UseImagesBorderStore()

  const handleChangeColor = (bg: string) => {
    setColor(bg)
    setType('solid')
  }

  return (
    <Typography.Block title='Colores:' className='bgConfig-section flex flex-col gap-grid-lg'>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </Typography.Block>
  )
}

export default BorderColorsController
