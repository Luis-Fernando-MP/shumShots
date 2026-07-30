import type SectionBuilder from '@views/image-studio/types/sections.types'
import { FrameIcon, PaletteIcon, RatioIcon, SquareRoundCornerIcon, StretchHorizontalIcon } from 'lucide-react'
import { createElement, type ComponentType } from 'react'

type BorderBuilders = {
  radius: ComponentType<any>
  style: ComponentType<any>
  color: ComponentType<any>
  mat: ComponentType<any>
  size: ComponentType<any>
}

type BorderSectionOptions = {
  radiusDescription: string
  sizeDescription: string
}

const createBorderSections = (
  builders: BorderBuilders,
  options: BorderSectionOptions
): SectionBuilder[] =>
  [
    {
      key: 'border-radius',
      title: 'Redondeado',
      description: options.radiusDescription,
      SectionIcon: createElement(SquareRoundCornerIcon, { className: 'size-3.5' }),
      component: builders.radius
    },
    {
      key: 'border-style',
      title: 'Estilo de borde',
      description: 'Tipo y acabado del borde.',
      SectionIcon: createElement(FrameIcon, { className: 'size-3.5' }),
      component: builders.style
    },
    {
      key: 'border-colors',
      title: 'Color del borde',
      description: 'Paleta rápida o color personalizado.',
      SectionIcon: createElement(PaletteIcon, { className: 'size-3.5' }),
      component: builders.color
    },
    {
      key: 'border-mat',
      title: 'Passepartout',
      description: 'Marco interior tipo mat.',
      SectionIcon: createElement(RatioIcon, { className: 'size-3.5' }),
      component: builders.mat
    },
    {
      key: 'border-size',
      title: 'Grosor',
      description: options.sizeDescription,
      SectionIcon: createElement(StretchHorizontalIcon, { className: 'size-3.5' }),
      component: builders.size
    }
  ] satisfies SectionBuilder[]

export default createBorderSections
