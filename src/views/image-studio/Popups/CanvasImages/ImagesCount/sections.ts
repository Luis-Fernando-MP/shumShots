import type SectionBuilder from '@views/image-studio/types/sections.types'
import { FolderOpenIcon, ImagesIcon, LayoutGridIcon } from 'lucide-react'
import { createElement } from 'react'

import CountBuilder from './builders/CountBuilder'
import LibraryBuilder from './builders/LibraryBuilder'
import SlotsBuilder from './builders/SlotsBuilder'

const SECTIONS = [
  {
    key: 'count',
    title: 'Slots en el canvas',
    description: 'Solo añade o quita imágenes; no cambia el tamaño.',
    SectionIcon: createElement(LayoutGridIcon, { className: 'size-3.5' }),
    component: CountBuilder
  },
  {
    key: 'slots',
    title: 'Asignación por slot',
    description: 'Arrastra el asa para reordenar. Asigna por nombre o sube una nueva.',
    SectionIcon: createElement(ImagesIcon, { className: 'size-3.5' }),
    component: SlotsBuilder
  },
  {
    key: 'library',
    title: 'Biblioteca',
    description: 'Hasta 10 imágenes en la biblioteca.',
    SectionIcon: createElement(FolderOpenIcon, { className: 'size-3.5' }),
    component: LibraryBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
