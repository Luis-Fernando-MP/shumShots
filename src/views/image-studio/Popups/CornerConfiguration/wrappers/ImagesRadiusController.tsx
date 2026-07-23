import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import type { FC } from 'react'

const ImagesRadiusController: FC = () => {
  const borderStore = useImagesRadiusStore()
  return (
    <div className='borderConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Redondeado:</h3>
      <BorderRadiusConfiguration borderState={borderStore} />
    </div>
  )
}

export default ImagesRadiusController
