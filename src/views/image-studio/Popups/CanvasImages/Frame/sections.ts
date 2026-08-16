import { Maximize2Icon, SmartphoneIcon } from 'lucide-react'
import { createElement } from 'react'

import type SectionBuilder from '@views/image-studio/types/sections.types'

import DeviceFramesBuilder from './builders/DeviceFramesBuilder'
import FitModeBuilder from './builders/FitModeBuilder'

const SECTIONS = [
  {
    key: 'device-frames',
    title: 'Device frames',
    description: 'Se aplica a los destinos del tab activo.',
    SectionIcon: createElement(SmartphoneIcon, { className: 'size-3.5' }),
    component: DeviceFramesBuilder
  },
  {
    key: 'fit-mode',
    title: 'Ajuste de imagen',
    description: 'Cómo encaja la foto en el slot.',
    SectionIcon: createElement(Maximize2Icon, { className: 'size-3.5' }),
    component: FitModeBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
