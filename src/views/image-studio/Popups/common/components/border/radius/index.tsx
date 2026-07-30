'use client'

import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { IBorderRadiusStore } from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import type { FC } from 'react'

type Props = {
  borderState: IBorderRadiusStore
  title?: string
  description?: string
}

const BorderRadius: FC<Props> = ({
  borderState,
  title = 'Redondeado',
  description = 'Suaviza las esquinas.'
}) => (
  <SectionBlock title={title} description={description}>
    <BorderRadiusConfiguration borderState={borderState} />
  </SectionBlock>
)

export default BorderRadius
