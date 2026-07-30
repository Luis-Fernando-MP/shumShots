'use client'

import BorderMat from '@views/image-studio/Popups/common/components/border/mat'
import type { FC } from 'react'

import { useCornerBorderAdapter } from '../../store/corner/adapters'

type Props = { tabId: string; targetIds: string[] }

const BorderMatBuilder: FC<Props> = ({ tabId }) => {
  const borderState = useCornerBorderAdapter(tabId)
  return <BorderMat borderState={borderState} />
}

export default BorderMatBuilder
