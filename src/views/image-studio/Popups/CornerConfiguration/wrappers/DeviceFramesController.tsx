'use client'

import DeviceFramePresets from '@views/image-studio/components/DeviceFramePresets'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const DeviceFramesController: FC = () => (
  <SectionBlock title='Device frames' description='Se aplica a todas las imágenes.'>
    <DeviceFramePresets />
  </SectionBlock>
)

export default DeviceFramesController
