'use client'

import ColorsController from '@/shared/components/ColorsController'
import { extractColor } from '@/shared/components/extractColor'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const ShadowColorsWrapper: FC = () => {
  const type = useShadowStore(s => s.type)
  const color = useShadowStore(s => s.color)
  const setColor = useShadowStore(s => s.setColor)

  if (type === 'none') return null

  const handleChangeColor = (bg: string) => {
    const spread = extractColor(bg)
    if (!spread) return
    setColor(`${spread.r},${spread.g},${spread.b}`)
  }

  return (
    <SectionBlock title='Color'>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </SectionBlock>
  )
}

export default ShadowColorsWrapper
