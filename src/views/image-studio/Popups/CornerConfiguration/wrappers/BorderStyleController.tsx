'use client'

import BorderStylePresets from '@/shared/components/BorderStylePresets'
import { useActiveTabId } from '@views/image-studio/shared/components/tabs'
import { useCornerBorderAdapter } from '@views/image-studio/store/corner/adapters'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const BorderStyleController: FC = () => {
  const tabId = useActiveTabId()
  const borderState = useCornerBorderAdapter(tabId)

  return (
    <SectionBlock title='Estilo de borde'>
      <BorderStylePresets borderState={borderState} />
    </SectionBlock>
  )
}

export default BorderStyleController
