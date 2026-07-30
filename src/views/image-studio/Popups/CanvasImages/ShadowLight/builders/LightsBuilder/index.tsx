'use client'

import LayerPanel from '@views/image-studio/Popups/CanvasImages/ShadowLight/shared/LayerPanel'
import type { FC } from 'react'

type Props = { tabId: string }

const LightsBuilder: FC<Props> = ({ tabId }) => <LayerPanel kind='light' tabId={tabId} />

export default LightsBuilder
