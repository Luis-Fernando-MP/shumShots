'use client'

import SliceContainer from '@common/components/SliceContainer'
import DeviceFramePresets from '@views/image-studio/components/DeviceFramePresets'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

type Props = { tabId: string; targetIds: string[] }

const DeviceFramesBuilder: FC<Props> = ({ tabId }) => (
  <SectionBlock title='Marcos' description='Se aplica a los destinos del tab activo.'>
    <SliceContainer maxHeight={180} extendedMaxHeight={520}>
      <DeviceFramePresets tabId={tabId} />
    </SliceContainer>
  </SectionBlock>
)

export default DeviceFramesBuilder
