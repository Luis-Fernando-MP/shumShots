import createBorderSections from '@views/image-studio/Popups/common/sections/border'
import type SectionBuilder from '@views/image-studio/types/sections.types'

import BorderColorsBuilder from './builders/BorderColorsBuilder'
import BorderMatBuilder from './builders/BorderMatBuilder'
import BorderSizeBuilder from './builders/BorderSizeBuilder'
import BorderStyleBuilder from './builders/BorderStyleBuilder'
import ImagesRadiusBuilder from './builders/ImagesRadiusBuilder'

const SECTIONS = [
  ...createBorderSections(
    {
      radius: ImagesRadiusBuilder,
      style: BorderStyleBuilder,
      color: BorderColorsBuilder,
      mat: BorderMatBuilder,
      size: BorderSizeBuilder
    },
    {
      radiusDescription: 'Suaviza las esquinas de la imagen.',
      sizeDescription: 'Ancho del borde de la imagen.'
    }
  )
] satisfies SectionBuilder[]

export default SECTIONS
