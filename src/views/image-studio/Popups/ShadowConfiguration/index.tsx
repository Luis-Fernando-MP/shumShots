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
    <Popup title='Imágenes - Sombras' className='shadowConfig-popup flex h-[700px] w-[350px] flex-col gap-grid-xl'>
      <Popup.Trigger>
        <Button tooltip='Sombras'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>
      <ShadowOpacityWrapper />
      <ShadowBlurSpreadWrapper />
      <ShadowPositionWrapper />
      <ShadowColorsWrapper />
    </Popup>
  )
}

export default ShadowConfiguration
