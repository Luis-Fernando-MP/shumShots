import { Maximize2Icon, MoveIcon, SmartphoneIcon } from 'lucide-react'
import { createElement } from 'react'

import type SectionBuilder from '@views/image-studio/types/sections.types'

import DeviceFramesBuilder from './builders/DeviceFramesBuilder'
import FitModeBuilder from './builders/FitModeBuilder'
import SlotPanBuilder from './builders/SlotPanBuilder'

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
    description: 'Cómo encaja la foto dentro de la zona verde del frame.',
    SectionIcon: createElement(Maximize2Icon, { className: 'size-3.5' }),
    component: FitModeBuilder
  },
  {
    key: 'slot-pan',
    title: 'Posición en el frame',
    description: 'Arrastra el recuadro para mover la imagen en los slots seleccionados.',
    SectionIcon: createElement(MoveIcon, { className: 'size-3.5' }),
    component: SlotPanBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
