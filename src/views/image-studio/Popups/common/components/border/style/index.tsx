'use client'

import BorderStylePresets from '@common/components/BorderStylePresets'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { BorderConfigurationState } from '@views/image-studio/Popups/common/components/createBorderStore'
import type { FC } from 'react'

type Props = {
  borderState: BorderConfigurationState
  title?: string
}

const BorderStyle: FC<Props> = ({ borderState, title = 'Estilo de borde' }) => (
  <SectionBlock title={title}>
    <BorderStylePresets borderState={borderState} />
  </SectionBlock>
)

export default BorderStyle
