'use client'

import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import ColorsController from '@/shared/components/ColorsController'
import { extractColor } from '@/shared/components/extractColor'
import Typography from '@common/ui/Typography'
import type { FC } from 'react'

const ShadowColorsWrapper: FC = () => {
  const color = useShadowStore(s => s.color)
  const setColor = useShadowStore(s => s.setColor)

  const handleChangeColor = (bg: string) => {
    const spread = extractColor(bg)
    if (!spread) return
    setColor(`${spread.r},${spread.g},${spread.b}`)
  }

  return (
    <Typography.Block title='Colores' className='gap-grid-lg flex flex-col'>
      <ColorsController background={color} setBackground={handleChangeColor} />
    </Typography.Block>
  )
}

export default ShadowColorsWrapper
