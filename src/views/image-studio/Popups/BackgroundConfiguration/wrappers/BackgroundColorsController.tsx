import useBackgroundStore from '@views/image-studio/store/background/background.store'
import ColorsController from '@/shared/components/ColorsController'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BackgroundColorsController: FC = () => {
  const { background, setBackground } = useBackgroundStore()

  return (
    <Typography.Block title='Colores:' className='bgConfig-section flex flex-col gap-grid-lg'>
      <ColorsController background={background} setBackground={setBackground} />
    </Typography.Block>
  )
}

export default BackgroundColorsController
