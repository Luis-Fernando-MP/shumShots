import type SectionBuilder from '@views/image-studio/types/sections.types'
import { LayersIcon, Layers2Icon, SlidersHorizontalIcon, SunIcon, TargetIcon } from 'lucide-react'
import { createElement } from 'react'

import AdjustmentsBuilder from './builders/AdjustmentsBuilder'
import FocusBuilder from './builders/FocusBuilder'
import LayersBuilder from './builders/LayersBuilder'
import PresetsBuilder from './builders/PresetsBuilder'
import StackBuilder from './builders/StackBuilder'

const SECTIONS = [
  {
    key: 'stack',
    title: 'Apilado',
    description: 'Luz por encima o debajo de las imágenes.',
    SectionIcon: createElement(Layers2Icon, { className: 'size-3.5' }),
    component: StackBuilder
  },
  {
    key: 'layers',
    title: 'Capas',
    description: 'Una o varias luces sobre el mismo canvas.',
    SectionIcon: createElement(LayersIcon, { className: 'size-3.5' }),
    component: LayersBuilder
  },
  {
    key: 'presets',
    title: 'Estilos',
    description: 'Presets de luz para el canvas.',
    SectionIcon: createElement(SunIcon, { className: 'size-3.5' }),
    component: PresetsBuilder
  },
  {
    key: 'focus',
    title: 'Foco',
    description: 'Dirección de la luz activa.',
    SectionIcon: createElement(TargetIcon, { className: 'size-3.5' }),
    component: FocusBuilder
  },
  {
    key: 'adjustments',
    title: 'Ajustes',
    description: 'Intensidad, alcance y color.',
    SectionIcon: createElement(SlidersHorizontalIcon, { className: 'size-3.5' }),
    component: AdjustmentsBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
