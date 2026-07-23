import { circularGradients, gradients } from '@/shared/backgroundStyle'
import type { FC } from 'react'

import SliceContainer from '../SliceContainer'
interface Props {
  background: string | null
  blendMode: string
  setBlendMode: (blendMode: string) => void
  setBackground: (background: string) => void
}

const GradientsController: FC<Props> = ({ background, setBackground, blendMode, setBlendMode }) => {
  const handleSelectBackground = (gradient: string, blendMode?: string) => {
    setBackground(gradient)
    setBlendMode(blendMode ?? 'normal')
  }
  return (
    <article className='flex flex-wrap gap-3'>
      <div className='flex flex-col gap-2'>
        <h3 className='paragraph-highlight'># Gradientes:</h3>
        <SliceContainer maxHeight={105} className='flex flex-row flex-wrap gap-1 overflow-hidden'>
          {gradients.map(item => {
            const { gradient, blendMode } = item
            return (
              <button
                className='size-[50px] rounded-lg'
                style={{ background: gradient, backgroundBlendMode: blendMode }}
                key={gradient}
                onClick={() => handleSelectBackground(gradient, blendMode)}
              />
            )
          })}
        </SliceContainer>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='paragraph-highlight'># Gradientes Circulares:</h3>
        <SliceContainer maxHeight={105} className='flex flex-row flex-wrap gap-1 overflow-hidden'>
          {circularGradients.map(item => {
            const { gradient } = item
            return (
              <button
                className='size-[50px] rounded-lg'
                style={{ background: gradient }}
                key={gradient}
                onClick={() => handleSelectBackground(gradient)}
              />
            )
          })}
        </SliceContainer>
      </div>
    </article>
  )
}

export default GradientsController
