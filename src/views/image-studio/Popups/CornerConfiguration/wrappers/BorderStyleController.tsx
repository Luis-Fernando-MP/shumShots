import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import BorderConfiguration from '@/shared/components/BorderConfiguration'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BorderStyleController: FC = () => {
  const borderState = UseImagesBorderStore()

  return (
    <Typography.Block title='Estilo de borde:' className='borderConfig-section flex flex-col gap-grid-lg'>
      <BorderConfiguration borderState={borderState} />
    </Typography.Block>
  )
}

export default BorderStyleController
