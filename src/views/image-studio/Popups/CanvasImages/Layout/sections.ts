import type SectionBuilder from '@views/image-studio/types/sections.types'
import { LinkIcon, MapPinIcon, MoveIcon, SlidersHorizontalIcon } from 'lucide-react'
import { createElement } from 'react'

import AdvancedPoseBuilder from './builders/AdvancedPoseBuilder'
import ConstrainBuilder from './builders/ConstrainBuilder'
import PositionsBuilder from './builders/PositionsBuilder'
import SlotMoveBuilder from './builders/SlotMoveBuilder'

export const GLOBAL_SECTIONS = [
  {
    key: 'constrain',
    title: 'Relación padre–hijo',
    description: 'Si está activo, los slots respetan el aspect y caben en el 90% del fondo.',
    SectionIcon: createElement(LinkIcon, { className: 'size-3.5' }),
    component: ConstrainBuilder
  },
  {
    key: 'positions',
    title: 'Posiciones',
    description: 'Estilos de composición para el número de slots actual.',
    SectionIcon: createElement(MapPinIcon, { className: 'size-3.5' }),
    component: PositionsBuilder
  },
  {
    key: 'advanced',
    title: 'Ajustes avanzados',
    description: 'Ajuste manual de posición, escala y transformación del slot seleccionado.',
    SectionIcon: createElement(SlidersHorizontalIcon, { className: 'size-3.5' }),
    component: AdvancedPoseBuilder
  }
] satisfies SectionBuilder[]

export const TAB_SECTIONS = [
  {
    key: 'move',
    title: 'Mover slots',
    description: 'Desplaza visualmente cada slot o todos a la vez.',
    SectionIcon: createElement(MoveIcon, { className: 'size-3.5' }),
    component: SlotMoveBuilder
  }
] satisfies SectionBuilder[]

const SECTIONS = [...GLOBAL_SECTIONS, ...TAB_SECTIONS]

export default SECTIONS
