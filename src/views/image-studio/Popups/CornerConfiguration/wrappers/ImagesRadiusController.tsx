import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const ImagesRadiusController: FC = () => {
  const borderStore = useImagesRadiusStore()
  return (
    <Typography.Block title='Redondeado:' className='borderConfig-section flex flex-col gap-grid-lg'>
      <BorderRadiusConfiguration borderState={borderStore} />
    </Typography.Block>
  )
}

export default ImagesRadiusController
