import UseImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import SliderControl from '@/shared/components/SliderControl'
import Button from '@/shared/ui/Button'
import { RotateCcwIcon } from 'lucide-react'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

const BorderSizeController: FC = () => {
  const { setSize, size } = UseImagesBorderStore()

  return (
    <Typography.Block title='Tamaño de borde:' className='borderConfig-section flex flex-col gap-grid-lg'>
      <Typography.Paragraph tone='secondary'>Depende de la selección de un borde seleccionado</Typography.Paragraph>
      <Button onClick={() => setSize(5)}>
        <RotateCcwIcon />
        <h5>Restablecer</h5>
      </Button>
      <SliderControl
        value={size}
        width={200}
        label='Tamaño'
        onChangeRange={v => {
          setSize(v)
        }}
        min={2}
        max={20}
        step={1}
      />
    </Typography.Block>
  )
}

export default BorderSizeController
