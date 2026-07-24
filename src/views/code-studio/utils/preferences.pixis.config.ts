import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import monacoLanguagesIcons from '@/shared/monaco-languages'

import type {
  HeaderDensity,
  MacTrafficPreset,
  PixisChromeState,
  PreferenceFieldDef,
  PreferenceGroup,
  PixisState
} from './preferences.types'

const language = monacoLanguagesIcons['Frontend Web'].typescript
const typography = monacoFonts.monospace.style.fontFamily

export const MAC_TRAFFIC_PRESETS: Record<
  MacTrafficPreset,
  { close: string; minimize: string; maximize: string; label: string }
> = {
  classic: { close: '#ff605c', minimize: '#ffbd44', maximize: '#00ca4e', label: 'Classic' },
  graphite: { close: '#8e8e93', minimize: '#aeaeb2', maximize: '#c7c7cc', label: 'Graphite' },
  candy: { close: '#ff6b9d', minimize: '#ffc857', maximize: '#7bdff2', label: 'Candy' },
  mono: { close: '#3a3a3c', minimize: '#636366', maximize: '#8e8e93', label: 'Mono' }
}

export const HEADER_DENSITY_PX: Record<HeaderDensity, number> = {
  compact: 36,
  comfortable: 44,
  tall: 56
}

export const EXPLORER_WIDTH_MIN = 120
export const EXPLORER_WIDTH_MAX = 320
export const EXPLORER_WIDTH_DEFAULT = 176

export const BREADCRUMB_SEPARATORS = ['/', '>', '›', '·'] as const

export const chromeDefaults = {
  controls: 'mac',
  controlsSide: 'left',
  titleAlign: 'center',
  macColors: 'classic',
  headerDensity: 'comfortable',
  headerTint: 'none',
  headerAccent: false,
  breadcrumb: false,
  breadcrumbSeparator: '/',
  statusBar: false,
  statusBarDensity: 'full',
  activityBar: false,
  fileExplorer: false,
  explorerWidthPx: EXPLORER_WIDTH_DEFAULT,
  tabStyle: 'soft',
  tabBadges: true,
  showTabAdd: false
} satisfies PixisChromeState

export const CHROME_LOOK_PRESETS: {
  id: string
  label: string
  description: string
  patch: Partial<PixisChromeState>
}[] = [
  {
    id: 'macos',
    label: 'macOS',
    description: 'Bolitas, título centrado, header suave',
    patch: {
      controls: 'mac',
      controlsSide: 'left',
      titleAlign: 'center',
      macColors: 'classic',
      headerTint: 'subtle',
      headerAccent: false,
      activityBar: false,
      fileExplorer: false,
      statusBar: false,
      breadcrumb: false,
      showTabAdd: false
    }
  },
  {
    id: 'vscode',
    label: 'VS Code',
    description: 'Tabs, explorer, activity y status bar',
    patch: {
      controls: 'none',
      tabStyle: 'underline',
      tabBadges: true,
      showTabAdd: true,
      headerTint: 'solid',
      headerAccent: true,
      activityBar: true,
      fileExplorer: true,
      explorerWidthPx: EXPLORER_WIDTH_DEFAULT,
      breadcrumb: true,
      breadcrumbSeparator: '/',
      statusBar: true,
      statusBarDensity: 'full'
    }
  },
  {
    id: 'windows',
    label: 'Windows',
    description: 'Controles a la derecha y tabs browser',
    patch: {
      controls: 'windows',
      controlsSide: 'right',
      titleAlign: 'left',
      tabStyle: 'browser',
      showTabAdd: false,
      headerTint: 'subtle',
      headerAccent: false,
      statusBar: true,
      statusBarDensity: 'compact',
      breadcrumb: false
    }
  },
  {
    id: 'minimal',
    label: 'Minimal',
    description: 'Sin chrome extra, solo el código',
    patch: {
      controls: 'none',
      breadcrumb: false,
      statusBar: false,
      activityBar: false,
      fileExplorer: false,
      headerTint: 'none',
      headerAccent: false,
      showTabAdd: false
    }
  }
]

export const matchesChromePreset = (
  chrome: PixisChromeState,
  patch: Partial<PixisChromeState>
) => Object.entries(patch).every(([key, value]) => chrome[key as keyof PixisChromeState] === value)

export const pixisDefaults = {
  showLanguageIcon: true,
  shadowLanguage: false,
  borderRadius: 20,
  containerWidth: 900,
  containerHeight: 600,
  containerPadding: 10,
  containerBorderRadius: 20,
  aspectRatio: 'default',
  chrome: chromeDefaults
} satisfies Omit<PixisState, 'language' | 'typography'>

export const getDefaultPixisState = (): PixisState => ({
  ...pixisDefaults,
  chrome: { ...chromeDefaults },
  language,
  typography
})

const field = <T>(def: PreferenceFieldDef<T>) => def

export const pixisPreferenceGroups = [
  {
    id: 'chrome',
    title: 'Chrome de ventana:',
    subtitle: 'Controles, tabs y marcos visuales del shot.',
    panel: true
  },
  {
    id: 'pixis',
    title: 'Pixis:',
    subtitle: 'Detalles visuales del shot: icono, radio y tamaño.',
    panel: true
  }
] satisfies PreferenceGroup[]

export const pixisPreferenceFields = {
  chrome: field({
    id: 'chrome',
    groupId: 'chrome',
    path: 'pixis.chrome',
    kind: 'custom',
    title: 'Estilo de ventana',
    subtitle: 'Controles, alineación y chrome decorativo',
    description: 'Personaliza cómo se ve el marco del editor en el shot.',
    default: chromeDefaults
  }),
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
