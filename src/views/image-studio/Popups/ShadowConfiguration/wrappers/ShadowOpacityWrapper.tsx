import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import SliderControl from '@/shared/components/SliderControl'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const ShadowOpacityWrapper: FC = () => {
  const { opacity, setOpacity } = useShadowStore()
  return (
    <Typography.Block title='Opacidad:' className='shadowConfig-section flex flex-col gap-grid-lg'>
      <Typography.Paragraph tone='secondary'>La opacidad se ajusta automáticamente con el movimiento del foco.</Typography.Paragraph>

      <SliderControl onChangeRange={v => setOpacity(v / 100)} value={Math.round(opacity * 100)} step={10} width={200} />
    </Typography.Block>
  )
}

export default ShadowOpacityWrapper
