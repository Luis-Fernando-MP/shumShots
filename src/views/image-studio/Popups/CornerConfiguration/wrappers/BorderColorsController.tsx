import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import ColorsController from '@/shared/components/ColorsController'
import type { FC } from 'react'

const BorderColorsController: FC = () => {
  const { color, setColor, setType } = UseImagesBorderStore()

  const handleChangeColor = (bg: string) => {
    setColor(bg)
    setType('solid')
  }

  return (
    <section className='bgConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Colores:</h3>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </section>
  )
}

export default BorderColorsController
