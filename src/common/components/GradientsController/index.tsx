'use client'

import { circularGradients, gradients } from '@common/constants/background-style'
import SliceContainer from '@common/components/SliceContainer'
import Text from '@common/components/Text'
import type { FC } from 'react'

interface Props {
  background: string | null
  blendMode: string
  setBlendMode: (blendMode: string) => void
  setBackground: (background: string) => void
}

const GradientTile = ({
  gradient,
  blendMode,
  label,
  onSelect
}: {
  gradient: string
  blendMode?: string
  label: string
  onSelect: () => void
}) => (
  <button
    type='button'
    onClick={onSelect}
    className='group relative aspect-[3/2] w-full overflow-hidden rounded-[12px]'
    style={{ background: gradient, backgroundBlendMode: blendMode }}
    aria-label={label}
  >
    <span className='from-background/80 absolute inset-x-0 bottom-0 bg-linear-to-t to-transparent px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100'>
      <Text.caption className='text-foreground'>{label}</Text.caption>
    </span>
  </button>
)

const GradientsController: FC<Props> = ({ setBackground, setBlendMode }) => {
  const handleSelectBackground = (gradient: string, nextBlendMode?: string) => {
    setBackground(gradient)
    setBlendMode(nextBlendMode ?? 'normal')
  }

  return (
    <div className='flex flex-col gap-6'>
      <section className='flex flex-col gap-2'>
        <Text.heading>Lineales</Text.heading>
        <SliceContainer maxHeight={140} extendedMaxHeight={420} className='grid grid-cols-2 gap-1.5'>
          {gradients.map((item, index) => (
            <GradientTile
              key={item.gradient}
              gradient={item.gradient}
              blendMode={item.blendMode}
              label={`Lineal ${index + 1}`}
              onSelect={() => handleSelectBackground(item.gradient, item.blendMode)}
            />
          ))}
        </SliceContainer>
      </section>

      <section className='flex flex-col gap-2'>
        <Text.heading>Circulares</Text.heading>
        <SliceContainer maxHeight={140} extendedMaxHeight={420} className='grid grid-cols-2 gap-1.5'>
          {circularGradients.map((item, index) => (
            <GradientTile
              key={item.gradient}
              gradient={item.gradient}
              label={`Circular ${index + 1}`}
              onSelect={() => handleSelectBackground(item.gradient)}
            />
          ))}
        </SliceContainer>
      </section>
    </div>
  )
}

export default GradientsController
