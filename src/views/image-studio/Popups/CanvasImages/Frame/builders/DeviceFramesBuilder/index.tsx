'use client'

import DeviceFramePresets from '@views/image-studio/components/DeviceFramePresets'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

type Props = { tabId: string; targetIds: string[] }

const DeviceFramesBuilder: FC<Props> = ({ tabId }) => (
  <SectionBlock title='Device frames' description='Se aplica a los destinos del tab activo.'>
    <DeviceFramePresets tabId={tabId} />
  </SectionBlock>
)

export default DeviceFramesBuilder
