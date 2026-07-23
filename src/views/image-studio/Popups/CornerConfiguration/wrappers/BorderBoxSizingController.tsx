import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import BoxSizingConfiguration from '@/shared/components/BoxSizingConfiguration'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BorderBoxSizingController: FC = () => {
  const { boxSizing, setBoxSizing } = UseImagesBorderStore()

  return (
    <Typography.Block title='Border box:' className='borderConfig-section flex flex-col gap-grid-lg'>
      <BoxSizingConfiguration boxSizing={boxSizing} setBoxSizing={setBoxSizing} />
    </Typography.Block>
  )
}

export default BorderBoxSizingController
