'use client'

import BorderColor from '@views/image-studio/Popups/common/components/border/color'
import type { FC } from 'react'

import { useCornerBorderAdapter } from '../../store/corner/adapters'

type Props = { tabId: string; targetIds: string[] }

const BorderColorsBuilder: FC<Props> = ({ tabId }) => {
  const { color, type, setColor, setType } = useCornerBorderAdapter(tabId)
  return <BorderColor color={color} type={type} setColor={setColor} setType={setType} />
}

export default BorderColorsBuilder
