import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import ShadowBlurSpreadConfiguration from '@/shared/components/ShadowBlurSpreadConfiguration'
import type { FC } from 'react'

const ShadowBlurSpreadWrapper: FC = () => {
  const { type, setShadowType } = useShadowStore()
  return (
    <section className='shadowConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Blur y Spread:</h3>
      <ShadowBlurSpreadConfiguration type={type} setType={setShadowType} />
    </section>
  )
}

export default ShadowBlurSpreadWrapper
