'use client'

import { circularGradients, gradients } from '@common/constants/background-style'
import SliceContainer from '@common/components/SliceContainer'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
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
  shape,
  selected,
  onSelect
}: {
  gradient: string
  blendMode?: string
  label: string
  shape: 'linear' | 'radial'
  selected: boolean
  onSelect: () => void
}) => (
  <button
    type='button'
    onClick={onSelect}
    aria-label={label}
    aria-pressed={selected}
    className={cn(
      'overflow-hidden transition-transform',
      shape === 'linear' ? 'aspect-[2.4/1] rounded-[12px]' : 'aspect-square rounded-[12px]',
      selected ? 'ring-primary ring-2 ring-offset-2 ring-offset-background' : 'hover:scale-[1.02]'
    )}
    style={{ background: gradient, backgroundBlendMode: blendMode }}
  />
)

const GradientsController: FC<Props> = ({ background, setBackground, setBlendMode }) => {
  const handleSelectBackground = (gradient: string, nextBlendMode?: string) => {
    setBackground(gradient)
    setBlendMode(nextBlendMode ?? 'normal')
  }

  return (
    <div className='flex flex-col gap-5'>
      <section className='flex flex-col gap-2'>
        <Text.caption className='tracking-[0.14em] uppercase'>Lineales</Text.caption>
        <SliceContainer
          maxHeight={118}
          extendedMaxHeight={520}
          collapsedVisible={6}
          className='grid grid-cols-3 gap-1'
          expandedClassName='gap-2.5'
        >
          {gradients.map((item, index) => (
            <GradientTile
              key={item.gradient}
              gradient={item.gradient}
              blendMode={item.blendMode}
              label={`Lineal ${index + 1}`}
              shape='linear'
              selected={background === item.gradient}
              onSelect={() => handleSelectBackground(item.gradient, item.blendMode)}
            />
          ))}
        </SliceContainer>
      </section>

      <section className='flex flex-col gap-2'>
        <Text.caption className='tracking-[0.14em] uppercase'>Radial</Text.caption>
        <SliceContainer
          maxHeight={118}
          extendedMaxHeight={520}
          collapsedVisible={9}
          className='grid grid-cols-3 gap-1'
          expandedClassName='gap-2.5'
        >
          {circularGradients.map((item, index) => (
            <GradientTile
              key={item.gradient}
              gradient={item.gradient}
              label={`Radial ${index + 1}`}
              shape='radial'
              selected={background === item.gradient}
              onSelect={() => handleSelectBackground(item.gradient)}
            />
          ))}
        </SliceContainer>
      </section>
    </div>
  )
}

export default GradientsController
