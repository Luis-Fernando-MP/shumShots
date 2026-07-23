import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import ShadowBlurSpreadConfiguration from '@/shared/components/ShadowBlurSpreadConfiguration'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const ShadowBlurSpreadWrapper: FC = () => {
  const { type, setShadowType } = useShadowStore()
  return (
    <Typography.Block title='Blur y Spread:' className='shadowConfig-section flex flex-col gap-grid-lg'>
      <ShadowBlurSpreadConfiguration type={type} setType={setShadowType} />
    </Typography.Block>
  )
}

export default ShadowBlurSpreadWrapper
