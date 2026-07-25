'use client'

import ColorsController from '@/shared/components/ColorsController'
import { extractColor } from '@/shared/components/extractColor'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const LightColorsWrapper: FC = () => {
  const lightType = useShadowStore(s => s.lightType)
  const lightColor = useShadowStore(s => s.lightColor)
  const setLightColor = useShadowStore(s => s.setLightColor)

  if (lightType === 'none') return null

  const handleChangeColor = (bg: string) => {
    const parsed = extractColor(bg)
    if (!parsed) return
    setLightColor(`${parsed.r},${parsed.g},${parsed.b}`)
  }

  return (
    <SectionBlock title='Color de luz'>
      <ColorsController background={lightColor} setBackground={handleChangeColor} />
    </SectionBlock>
  )
}

export default LightColorsWrapper
