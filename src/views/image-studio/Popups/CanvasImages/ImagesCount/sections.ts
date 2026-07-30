import type SectionBuilder from '@views/image-studio/types/sections.types'
import {
  FolderOpenIcon,
  ImagesIcon,
  LayoutGridIcon,
  LinkIcon,
  MapPinIcon
} from 'lucide-react'
import { createElement } from 'react'

import ConstrainBuilder from './builders/ConstrainBuilder'
import CountBuilder from './builders/CountBuilder'
import LibraryBuilder from './builders/LibraryBuilder'
import PositionsBuilder from './builders/PositionsBuilder'
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
    key: 'slots',
    title: 'Asignación por slot',
    description: 'Arrastra el asa para reordenar. Asigna por nombre o sube una nueva.',
    SectionIcon: createElement(ImagesIcon, { className: 'size-3.5' }),
    component: SlotsBuilder
  },
  {
    key: 'library',
    title: 'Biblioteca',
    description: 'Hasta 10 imágenes. Metadata en local · blobs en IndexedDB.',
    SectionIcon: createElement(FolderOpenIcon, { className: 'size-3.5' }),
    component: LibraryBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
