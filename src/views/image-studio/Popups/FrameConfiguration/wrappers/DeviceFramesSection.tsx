'use client'

import DeviceFramePresets from '@views/image-studio/components/DeviceFramePresets'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

type Props = { tabId: string }

const DeviceFramesSection: FC<Props> = ({ tabId }) => (
  <SectionBlock title='Device frames' description='Se aplica a los destinos del tab activo.'>
    <DeviceFramePresets tabId={tabId} />
  </SectionBlock>
)

export default DeviceFramesSection
