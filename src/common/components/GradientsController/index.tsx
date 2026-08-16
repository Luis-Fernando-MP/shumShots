'use client'

import { circularGradients, gradients } from '@common/constants/background-style'
import SliceContainer from '@common/components/SliceContainer'
import Typography from '@common/components/Typography'
import type { FC } from 'react'

interface Props {
  background: string | null
  blendMode: string
  setBlendMode: (blendMode: string) => void
  setBackground: (background: string) => void
}

const GradientsController: FC<Props> = ({ setBackground, setBlendMode }) => {
  const handleSelectBackground = (gradient: string, nextBlendMode?: string) => {
    setBackground(gradient)
    setBlendMode(nextBlendMode ?? 'normal')
  }

  return (
    <div className='gap-grid-lg flex flex-col'>
      <section className='gap-grid flex flex-col'>
        <Typography.Label size='xs' weight='semibold'>
          ## Lineales
        </Typography.Label>
        <SliceContainer maxHeight={105} className='flex flex-row flex-wrap gap-1 overflow-hidden'>
          {gradients.map(item => {
            const { gradient, blendMode } = item
            return (
              <button
                type='button'
                className='size-[50px] rounded-radius'
                style={{ background: gradient, backgroundBlendMode: blendMode }}
                key={gradient}
                onClick={() => handleSelectBackground(gradient, blendMode)}
              />
            )
          })}
        </SliceContainer>
      </section>

      <section className='gap-grid flex flex-col'>
        <Typography.Label size='xs' weight='semibold'>
          ## Circulares
        </Typography.Label>
        <SliceContainer maxHeight={105} className='flex flex-row flex-wrap gap-1 overflow-hidden'>
          {circularGradients.map(item => {
            const { gradient } = item
            return (
              <button
                type='button'
                className='size-[50px] rounded-radius'
                style={{ background: gradient }}
                key={gradient}
                onClick={() => handleSelectBackground(gradient)}
              />
            )
          })}
        </SliceContainer>
      </section>
    </div>
  )
}

export default GradientsController
