import { BorderConfigurationState, BorderType } from '@views/image-studio/store/images/useImagesBorderStore'
import BorderStyle from '@/shared/ui/BorderStyle'
import EmptyBlock from '@/shared/ui/EmptyBlock'
import type { FC } from 'react'

import SliderControl from '../SliderControl'
interface Props {
  borderState: BorderConfigurationState
}

export const defaultBorders = [
  { type: 'solid', color: 'rgba(255,255,255,.5)', label: 'Blanco transparente' },
  { type: 'solid', color: 'rgba(0, 0, 0, 0.3)', label: 'Negro transparente' },
  {
    type: 'gradient',
    label: 'Mora lineal',
    gradient: 'linear-gradient(to bottom right, rgb(176, 64, 246) 40%, rgba(242, 83, 83, 0.67))'
  },
  {
    type: 'gradient',
    label: 'Océano azul',
    gradient: 'linear-gradient(to right, #1a2980, #26d0ce)'
  },
  {
    type: 'gradient',
    label: 'Amanecer cálido',
    gradient: 'linear-gradient(to bottom right, #ff9966, #ff5e62)'
  },
  {
    type: 'gradient',
    label: 'Esmeralda brillante',
    gradient: 'linear-gradient(to right, #43cea2, #185a9d)'
  },
  {
    type: 'solid',
    color: 'rgba(255, 215, 0, 0.6)',
    label: 'Dorado suave'
  },
  {
    type: 'solid',
    color: 'rgba(75, 0, 130, 0.4)',
    label: 'Púrpura sutil'
  },
  {
    type: 'gradient',
    label: 'Neón vibrante',
    gradient: 'linear-gradient(to bottom left, #00FFFF, #FF00FF)'
  },
  {
    type: 'gradient',
    label: 'Atardecer tropical',
    gradient: 'linear-gradient(to right, #FF416C, #FF4B2B)'
  }
]

const BorderConfiguration: FC<Props> = ({ borderState }) => {
  const { type, color, gradient, setColor, setType, setGradient } = borderState

  const handleSetBorderType = (border: Omit<(typeof defaultBorders)[0], 'label'>) => {
    const { color, type, gradient } = border
    if (color) setColor(color)
    if (gradient) setGradient(gradient)
    setType(type as BorderType)
  }

  return (
    <article className='flex max-w-full flex-row flex-wrap gap-2'>
      <EmptyBlock onClick={() => handleSetBorderType({ type: 'none' })} selected={type === 'none'} />
      {defaultBorders.map(border => {
        return (
          <BorderStyle
            key={border.label}
            {...border}
            isActive={(border.color === color || border.gradient === gradient) && border.type === type}
            onClick={() => handleSetBorderType(border)}
          />
        )
      })}
    </article>
  )
}

export default BorderConfiguration
