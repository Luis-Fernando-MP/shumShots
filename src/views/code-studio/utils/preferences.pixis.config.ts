import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import monacoLanguagesIcons from '@/shared/monaco-languages'

import type { PreferenceFieldDef, PreferenceGroup, PixisState } from './preferences.types'

const language = monacoLanguagesIcons['Frontend Web'].typescript
const typography = monacoFonts.monospace.style.fontFamily

export const pixisDefaults = {
  showLanguageIcon: true,
  shadowLanguage: false,
  borderRadius: 20,
  containerWidth: 900,
  containerHeight: 600,
  containerPadding: 10,
  containerBorderRadius: 20,
  aspectRatio: 'default'
} satisfies Omit<PixisState, 'language' | 'typography'>

export const getDefaultPixisState = (): PixisState => ({
  ...pixisDefaults,
  language,
  typography
})

const field = <T>(def: PreferenceFieldDef<T>) => def

export const pixisPreferenceGroups = [
  {
    id: 'pixis',
    title: 'Pixis:',
    subtitle: 'Detalles visuales del shot: icono, radio y tamaño.',
    panel: true
  }
] satisfies PreferenceGroup[]

export const pixisPreferenceFields = {
  showLanguageIcon: field({
    id: 'showLanguageIcon',
    groupId: 'pixis',
    path: 'pixis.showLanguageIcon',
    kind: 'boolean',
    title: 'Icono del lenguaje',
    subtitle: 'Badge sobre el editor',
    description: 'Muestra el icono del lenguaje actual en el shot.',
    default: pixisDefaults.showLanguageIcon,
    options: [true, false]
  }),
  shadowLanguage: field({
    id: 'shadowLanguage',
    groupId: 'pixis',
    path: 'pixis.shadowLanguage',
    kind: 'boolean',
    title: 'Sombra del icono',
    subtitle: 'Glow para iconos claros',
    description: 'Ayuda cuando el logo es blanco o muy transparente.',
    note: 'Requiere icono del lenguaje activo.',
    default: pixisDefaults.shadowLanguage,
    options: [true, false]
  }),
  borderRadius: field({
    id: 'borderRadius',
    groupId: 'pixis',
    path: 'pixis.borderRadius',
    kind: 'number',
    title: 'Radio del editor',
    subtitle: 'Esquinas del área de código',
    example: 'Ej: Normal = 20px',
    default: pixisDefaults.borderRadius,
    options: [0, 5, 10, 15, 20, 25, 30, 35, 40],
    min: 0,
    max: 100,
    step: 5,
    suffix: 'px'
  }),
  containerBorderRadius: field({
    id: 'containerBorderRadius',
    groupId: 'pixis',
    path: 'pixis.containerBorderRadius',
    kind: 'number',
    title: 'Radio del contenedor',
    subtitle: 'Esquinas del marco exterior',
    example: 'Ej: 0 = cuadrado; 20 = suave',
    default: pixisDefaults.containerBorderRadius,
    options: [0, 5, 10, 15, 20, 25, 30, 35, 40],
    min: 0,
    max: 100,
    step: 5,
    suffix: 'px'
  }),
  containerHeight: field({
    id: 'containerHeight',
    groupId: 'pixis',
    path: 'pixis.containerHeight',
    kind: 'number',
    title: 'Alto',
    subtitle: 'Altura del editor',
    example: 'Ej: Normal = 600px',
    default: pixisDefaults.containerHeight,
    options: [300, 400, 500, 600, 700, 800, 900],
    min: 200,
    max: 1200,
    step: 50,
    suffix: 'px'
  }),
  containerWidth: field({
    id: 'containerWidth',
    groupId: 'pixis',
    path: 'pixis.containerWidth',
    kind: 'number',
    title: 'Ancho',
    subtitle: 'Ancho del editor',
    example: 'Ej: Normal = 900px',
    default: pixisDefaults.containerWidth,
    options: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    min: 200,
    max: 1200,
    step: 50,
    suffix: 'px'
  }),
  aspectRatio: field({
    id: 'aspectRatio',
    groupId: 'pixis',
    path: 'pixis.aspectRatio',
    kind: 'custom',
    title: 'Aspect ratio',
    subtitle: 'Proporción ancho × alto',
    description: 'La caja grande es el marco; la interna muestra la proporción.',
    example: 'Ej: Default = 900×600; Free = ratio personalizado',
    note: 'Con ratio activo, al cambiar ancho o alto se ajusta el otro lado.',
    default: pixisDefaults.aspectRatio,
    options: ['default', 'free', '1:1', '4:3', '3:2', '16:9', '9:16', '21:9']
  }),
  containerPadding: field({
    id: 'containerPadding',
    groupId: 'pixis',
    path: 'pixis.containerPadding',
    kind: 'number',
    title: 'Padding',
    subtitle: 'Aire interno del marco',
    example: 'Ej: Normal = 10px',
    default: pixisDefaults.containerPadding,
    options: [0, 5, 10, 15, 20, 25, 30, 35, 40],
    min: 0,
    max: 100,
    step: 5,
    suffix: 'px'
  })
}

export type PixisPreferenceFieldId = keyof typeof pixisPreferenceFields

export const applyPixisDom = (pixis: PixisState) => {
  const $editor = document.querySelector('#monacoEditor') as HTMLElement | null
  const $editorContainer = document.querySelector('#monacoEditor-container') as HTMLElement | null

  if ($editor) {
    $editor.style.borderRadius = `${pixis.borderRadius}px`
    $editor.style.height = `${pixis.containerHeight}px`
    $editor.style.width = `${pixis.containerWidth}px`
  }

  if ($editorContainer) {
    $editorContainer.style.borderRadius = `${pixis.containerBorderRadius}px`
    $editorContainer.style.padding = `${pixis.containerPadding}px`
  }
}
