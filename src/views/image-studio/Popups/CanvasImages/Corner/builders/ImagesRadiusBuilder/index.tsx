'use client'

import BorderRadius from '@views/image-studio/Popups/common/components/border/radius'
import type { FC } from 'react'

import { useCornerRadiusAdapter } from '../../store/corner/adapters'

type Props = { tabId: string; targetIds: string[] }

const ImagesRadiusBuilder: FC<Props> = ({ tabId }) => {
  const borderStore = useCornerRadiusAdapter(tabId)
  return (
    <BorderRadius
      borderState={borderStore}
      title='Redondeado'
      description='Suaviza las esquinas de la imagen.'
    />
  )
}

export default ImagesRadiusBuilder
