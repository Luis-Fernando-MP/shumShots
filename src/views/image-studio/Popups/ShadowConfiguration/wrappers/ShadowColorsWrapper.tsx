import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import ColorsController, { SpreadColor } from '@/shared/components/ColorsController'
import type { FC } from 'react'

const ShadowColorsWrapper: FC = () => {
  const { color, setColor } = useShadowStore()

  const handleChangeColor = (_color: string, spreadColor: SpreadColor | null) => {
    if (!spreadColor) return
    const { b, g, r } = spreadColor
    setColor(`${r},${g},${b}`)
  }

  return (
    <section className='shadowConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Colores:</h3>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </section>
  )
}

export default ShadowColorsWrapper
