import { createElement } from 'react'

import type SectionBuilder from '@views/image-studio/types/sections.types'
import { CloudSunIcon, Link2Icon, SunIcon } from 'lucide-react'

import LightsBuilder from './builders/LightsBuilder'
import LinkFocusBuilder from './builders/LinkFocusBuilder'
import ShadowsBuilder from './builders/ShadowsBuilder'

const SECTIONS = [
  {
    key: 'link-focus',
    title: 'Unir foco',
    description: 'Mueve juntos el foco de las capas activas de sombra y luz.',
    SectionIcon: createElement(Link2Icon, { className: 'size-3.5' }),
    component: LinkFocusBuilder
  },
  {
    key: 'shadows',
    title: 'Sombra',
    description: 'Estilo, foco e intensidad para los destinos del tab.',
    SectionIcon: createElement(CloudSunIcon, { className: 'size-3.5' }),
    component: ShadowsBuilder
  },
  {
    key: 'lights',
    title: 'Luz',
    description: 'Estilo, foco e intensidad para los destinos del tab.',
    SectionIcon: createElement(SunIcon, { className: 'size-3.5' }),
    component: LightsBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
