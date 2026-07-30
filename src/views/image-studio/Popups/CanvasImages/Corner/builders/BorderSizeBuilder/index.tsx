'use client'

import BorderSize from '@views/image-studio/Popups/common/components/border/size'
import type { FC } from 'react'

import { useCornerBorderAdapter } from '../../store/corner/adapters'

type Props = { tabId: string; targetIds: string[] }

const BorderSizeBuilder: FC<Props> = ({ tabId }) => {
  const { size, type, setSize } = useCornerBorderAdapter(tabId)
  return (
    <BorderSize
      size={size}
      type={type}
      setSize={setSize}
      defaultSize={5}
      description='Ancho del borde de la imagen.'
    />
  )
}

export default BorderSizeBuilder
