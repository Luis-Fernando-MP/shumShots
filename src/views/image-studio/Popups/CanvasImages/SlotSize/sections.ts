import type SectionBuilder from '@views/image-studio/types/sections.types'
import { ScalingIcon } from 'lucide-react'
import { createElement } from 'react'

import SizeControlsBuilder from './builders/SizeControlsBuilder'

const SECTIONS = [
  {
    key: 'size-controls',
    title: 'Ancho · Alto',
    description: 'Presets y valores manuales. Se ignora si el slot tiene frame.',
    SectionIcon: createElement(ScalingIcon, { className: 'size-3.5' }),
    component: SizeControlsBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
