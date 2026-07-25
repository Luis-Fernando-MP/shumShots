import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { CloudSunIcon } from 'lucide-react'
import { type FC } from 'react'

import ShadowBlurSpreadWrapper from './wrappers/ShadowBlurSpreadWrapper'
import ShadowColorsWrapper from './wrappers/ShadowColorsWrapper'
import ShadowOpacityWrapper from './wrappers/ShadowOpacityWrapper'
import ShadowPositionWrapper from './wrappers/ShadowPositionWrapper'

const ShadowConfiguration: FC = () => {
  return (
    <Popup className='h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Sombras'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>
      <Popup.Header>Imágenes - Sombras</Popup.Header>
      <Popup.Content className='gap-grid-xl flex flex-col'>
        <ShadowOpacityWrapper />
        <ShadowBlurSpreadWrapper />
        <ShadowPositionWrapper />
        <ShadowColorsWrapper />
      </Popup.Content>
    </Popup>
  )
}

export default ShadowConfiguration
