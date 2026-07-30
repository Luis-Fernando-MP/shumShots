'use client'

import LayerPanel from '@views/image-studio/Popups/CanvasImages/ShadowLight/shared/LayerPanel'
import type { FC } from 'react'

type Props = { tabId: string }

const ShadowsBuilder: FC<Props> = ({ tabId }) => <LayerPanel kind='shadow' tabId={tabId} />

export default ShadowsBuilder
