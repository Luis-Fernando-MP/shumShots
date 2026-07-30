import type SectionBuilder from '@views/image-studio/types/sections.types'
import {
  ApertureIcon,
  BlendIcon,
  CropIcon,
  DropletsIcon,
  ImageIcon,
  LayersIcon,
  Maximize2Icon,
  MoveIcon,
  PaletteIcon,
  RotateCwIcon,
  ScanIcon,
  UploadIcon,
  WallpaperIcon
} from 'lucide-react'
import { createElement } from 'react'

import BlurBuilder from './builders/BlurBuilder'
import ColorsBuilder from './builders/ColorsBuilder'
import DuotoneBuilder from './builders/DuotoneBuilder'
import FiltersBuilder from './builders/FiltersBuilder'
import GradientsBuilder from './builders/GradientsBuilder'
import OverlayBuilder from './builders/OverlayBuilder'
import PositionBuilder from './builders/PositionBuilder'
import RotationBuilder from './builders/RotationBuilder'
import ScaleBuilder from './builders/ScaleBuilder'
import SizeBuilder from './builders/SizeBuilder'
import UploadBuilder from './builders/UploadBuilder'
import VignetteBuilder from './builders/VignetteBuilder'
import WallpapersBuilder from './builders/WallpapersBuilder'

const SECTIONS = [
  {
    key: 'size',
    title: 'Tamaño',
    description: 'Dimensiones del canvas de fondo.',
    SectionIcon: createElement(Maximize2Icon, { className: 'size-3.5' }),
    component: SizeBuilder
  },
  {
    key: 'colors',
    title: 'Colores',
    description: 'Rellena el fondo con un color sólido.',
    SectionIcon: createElement(PaletteIcon, { className: 'size-3.5' }),
    component: ColorsBuilder
  },
  {
    key: 'gradients',
    title: 'Gradientes',
    description: 'Fondos con degradados lineales o circulares.',
    SectionIcon: createElement(BlendIcon, { className: 'size-3.5' }),
    component: GradientsBuilder
  },
  {
    key: 'wallpapers',
    title: 'Wallpapers',
    description: 'Imágenes predefinidas para el fondo.',
    SectionIcon: createElement(WallpaperIcon, { className: 'size-3.5' }),
    component: WallpapersBuilder
  },
  {
    key: 'upload',
    title: 'Imagen',
    description: 'Sube una imagen local como fondo.',
    SectionIcon: createElement(UploadIcon, { className: 'size-3.5' }),
    component: UploadBuilder
  },
  {
    key: 'position',
    title: 'Posición',
    description: 'Ajusta el encuadre del fondo.',
    SectionIcon: createElement(MoveIcon, { className: 'size-3.5' }),
    component: PositionBuilder
  },
  {
    key: 'scale',
    title: 'Escala',
    description: 'Zoom del contenido de fondo.',
    SectionIcon: createElement(CropIcon, { className: 'size-3.5' }),
    component: ScaleBuilder
  },
  {
    key: 'rotation',
    title: 'Rotación',
    description: 'Inclina el fondo.',
    SectionIcon: createElement(RotateCwIcon, { className: 'size-3.5' }),
    component: RotationBuilder
  },
  {
    key: 'overlay',
    title: 'Overlay',
    description: 'Capa de color encima del fondo.',
    SectionIcon: createElement(LayersIcon, { className: 'size-3.5' }),
    component: OverlayBuilder
  },
  {
    key: 'blur',
    title: 'Blur',
    description: 'Difumina el fondo.',
    SectionIcon: createElement(ApertureIcon, { className: 'size-3.5' }),
    component: BlurBuilder
  },
  {
    key: 'duotone',
    title: 'Duotone',
    description: 'Look de dos colores.',
    SectionIcon: createElement(DropletsIcon, { className: 'size-3.5' }),
    component: DuotoneBuilder
  },
  {
    key: 'filters',
    title: 'Filtros',
    description: 'Ajustes de color y contraste.',
    SectionIcon: createElement(ImageIcon, { className: 'size-3.5' }),
    component: FiltersBuilder
  },
  {
    key: 'vignette',
    title: 'Viñeta',
    description: 'Oscurece los bordes del fondo.',
    SectionIcon: createElement(ScanIcon, { className: 'size-3.5' }),
    component: VignetteBuilder
  }
] satisfies SectionBuilder[]

export default SECTIONS
