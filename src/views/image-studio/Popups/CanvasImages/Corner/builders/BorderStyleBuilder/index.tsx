'use client'

import BorderStyle from '@views/image-studio/Popups/common/components/border/style'
import type { FC } from 'react'

import { useCornerBorderAdapter } from '../../store/corner/adapters'

type Props = { tabId: string; targetIds: string[] }

const BorderStyleBuilder: FC<Props> = ({ tabId }) => {
  const borderState = useCornerBorderAdapter(tabId)
  return <BorderStyle borderState={borderState} />
}

export default BorderStyleBuilder
