import Popup from '@/shared/components/Popup'
import IconButton from '@/shared/ui/IconButton'
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
        <IconButton label='Sombras' transparent>
          <CloudSunIcon />
        </IconButton>
      </Popup.Trigger>
      <ShadowOpacityWrapper />
      <ShadowBlurSpreadWrapper />
      <ShadowPositionWrapper />
      <ShadowColorsWrapper />
    </Popup>
  )
}

export default ShadowConfiguration
