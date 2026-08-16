import type SectionBuilder from '@views/image-studio/types/sections.types'
import { ScalingIcon } from 'lucide-react'
import { createElement } from 'react'

import SizeControlsBuilder from './builders/SizeControlsBuilder'

const SECTIONS = [
  {
    key: 'size-controls',
    title: 'Ancho · Alto',
    description: 'La proporción del preset se mantiene. Escala o cambia un lado y el otro sigue.',
    SectionIcon: createElement(ScalingIcon, { className: 'size-3.5' }),
    component: SizeControlsBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
