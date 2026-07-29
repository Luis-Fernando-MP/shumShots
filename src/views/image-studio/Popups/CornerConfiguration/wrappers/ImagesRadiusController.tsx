'use client'

import BorderRadiusConfiguration from '@/shared/components/BorderRadiusConfiguration'
import { useActiveTabId } from '@views/image-studio/shared/components/tabs'
import { useCornerRadiusAdapter } from '@views/image-studio/store/corner/adapters'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const ImagesRadiusController: FC = () => {
  const tabId = useActiveTabId()
  const borderStore = useCornerRadiusAdapter(tabId)

  return (
    <SectionBlock title='Redondeado' description='Suaviza las esquinas de la imagen.'>
      <BorderRadiusConfiguration borderState={borderStore} />
    </SectionBlock>
  )
}

export default ImagesRadiusController
