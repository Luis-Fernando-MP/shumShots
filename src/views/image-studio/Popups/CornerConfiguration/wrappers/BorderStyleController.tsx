import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import BorderConfiguration from '@/shared/components/BorderConfiguration'
import type { FC } from 'react'

const BorderStyleController: FC = () => {
  const borderState = UseImagesBorderStore()

  return (
    <div className='borderConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Estilo de borde:</h3>
      <BorderConfiguration borderState={borderState} />
    </div>
  )
}

export default BorderStyleController
