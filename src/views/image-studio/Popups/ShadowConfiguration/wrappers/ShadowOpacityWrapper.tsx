import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import SliderControl from '@/shared/components/SliderControl'
import type { FC } from 'react'

const ShadowOpacityWrapper: FC = () => {
  const { opacity, setOpacity } = useShadowStore()
  return (
    <section className='shadowConfig-section flex flex-col gap-grid-lg'>
      <h3 className='paragraph-highlight'># Opacidad:</h3>
      <p className='paragraph-normal'>La opacidad se ajusta automáticamente con el movimiento del foco.</p>

      <SliderControl onChangeRange={v => setOpacity(v / 100)} value={Math.round(opacity * 100)} step={10} width={200} />
    </section>
  )
}

export default ShadowOpacityWrapper
