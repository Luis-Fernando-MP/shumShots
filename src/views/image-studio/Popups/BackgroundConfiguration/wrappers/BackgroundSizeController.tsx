import useBackgroundStore from '@views/image-studio/store/background/background.store'
import SizeController from '@/shared/components/SizeController'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BackgroundSizeController: FC = () => {
  const { backgroundWidth, backgroundHeight, setBackgroundWidth, setBackgroundHeight } = useBackgroundStore()

  return (
    <Typography.Block title='Tamaño:' className='bgConfig-section flex flex-col gap-grid-lg'>
      <SizeController
        width={backgroundWidth}
        height={backgroundHeight}
        setWidth={setBackgroundWidth}
        setHeight={setBackgroundHeight}
      />
    </Typography.Block>
  )
}

export default BackgroundSizeController
