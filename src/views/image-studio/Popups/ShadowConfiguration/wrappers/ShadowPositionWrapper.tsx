import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import useBoardStore from '@/shared/components/Board/board.store'
import FocusConfiguration from '@/shared/components/FocusConfiguration'
import Button from '@/shared/ui/Button'
import { ZoomInIcon } from 'lucide-react'
import { type FC, memo } from 'react'
import Typography from '@common/ui/Typography'

const AdjustZoom: FC = memo(() => {
  const { zoomCentered } = useBoardStore()
  const handleClick = () => {
    zoomCentered('in')
  }
  return (
    <Button tooltip='Zoom' onClick={handleClick}>
      <ZoomInIcon />
      <h5 className='shadowConfig-label'>AJustar zoom</h5>
    </Button>
  )
})

AdjustZoom.displayName = 'AdjustZoom'

const ShadowPositionWrapper: FC = () => {
  const { type, setPosition, setBlur, setSpread, setOpacity } = useShadowStore()
  return (
    <Typography.Block title='Foco:' className='shadowConfig-section flex flex-col gap-grid-lg'>
      <Typography.Paragraph tone='secondary'>Mantén un zoom del 100% para que el foco se ajuste bien a la imagen.</Typography.Paragraph>
      <AdjustZoom />
      <FocusConfiguration
        setPosition={setPosition}
        shadowType={type}
        setBlur={setBlur}
        setSpread={setSpread}
        setOpacity={setOpacity}
      />
    </Typography.Block>
  )
}

export default ShadowPositionWrapper
