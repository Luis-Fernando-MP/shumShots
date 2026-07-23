import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import ColorsController, { SpreadColor } from '@/shared/components/ColorsController'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const ShadowColorsWrapper: FC = () => {
  const { color, setColor } = useShadowStore()

  const handleChangeColor = (_color: string, spreadColor: SpreadColor | null) => {
    if (!spreadColor) return
    const { b, g, r } = spreadColor
    setColor(`${r},${g},${b}`)
  }

  return (
    <Typography.Block title='Colores:' className='shadowConfig-section flex flex-col gap-grid-lg'>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </Typography.Block>
  )
}

export default ShadowColorsWrapper
