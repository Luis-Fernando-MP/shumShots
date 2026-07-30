import createBorderSections from '@views/image-studio/Popups/common/sections/border'
import type SectionBuilder from '@views/image-studio/types/sections.types'
import { FrameIcon } from 'lucide-react'
import { createElement } from 'react'

import ColorsBuilder from './builders/ColorsBuilder'
import FrameTemplateBuilder from './builders/FrameTemplateBuilder'
import MatBuilder from './builders/MatBuilder'
import RadiusBuilder from './builders/RadiusBuilder'
import SizeBuilder from './builders/SizeBuilder'
import StyleBuilder from './builders/StyleBuilder'

const borderSections = createBorderSections(
  {
    radius: RadiusBuilder,
    style: StyleBuilder,
    color: ColorsBuilder,
    mat: MatBuilder,
    size: SizeBuilder
  },
  {
    radiusDescription: 'Suaviza las esquinas del canvas.',
    sizeDescription: 'Ancho del borde del canvas.'
  }
)

const SECTIONS = [
  ...borderSections.slice(0, 3),
  {
    key: 'frame-template',
    title: 'Plantillas de frame',
    description: 'Polaroid, marco o tarjeta.',
    SectionIcon: createElement(FrameIcon, { className: 'size-3.5' }),
    component: FrameTemplateBuilder
  },
  ...borderSections.slice(3)
] satisfies SectionBuilder[]

export default SECTIONS
