'use client'

import { useActiveTabId } from '@views/image-studio/shared/components/tabs'
import { useCornerBorderAdapter } from '@views/image-studio/store/corner/adapters'
import type { FC } from 'react'

import BorderMatControls from '../../shared/BorderMatControls'

const BorderMatController: FC = () => {
  const tabId = useActiveTabId()
  const borderState = useCornerBorderAdapter(tabId)
  return <BorderMatControls borderState={borderState} />
}

export default BorderMatController
