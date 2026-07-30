import type SectionBuilder from '@views/image-studio/types/sections.types'
import { LayersIcon, SlidersHorizontalIcon, SunIcon, TargetIcon } from 'lucide-react'
import { createElement } from 'react'

import AdjustmentsBuilder from './builders/AdjustmentsBuilder'
import FocusBuilder from './builders/FocusBuilder'
import LayersBuilder from './builders/LayersBuilder'
import PresetsBuilder from './builders/PresetsBuilder'

const SECTIONS = [
  {
    key: 'layers',
    title: 'Capas',
    description: 'Luces aplicadas sobre el canvas de fondo.',
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
