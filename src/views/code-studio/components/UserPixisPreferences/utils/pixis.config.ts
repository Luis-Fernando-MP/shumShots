import monacoLanguagesIcons from '@/shared/monaco-languages'
import { DEFAULT_MONACO_FONT_ID } from '@common/monaco'
import type {
  HeaderDensity,
  MacTrafficPreset,
  PixisChromeState,
  PixisState,
  PreferenceFieldDef,
  PreferenceGroup
} from '@views/code-studio/utils/preferences/types'

const language = monacoLanguagesIcons['Frontend Web'].typescript
const typography = DEFAULT_MONACO_FONT_ID

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
  patch: Partial<PixisChromeState>
}[] = [
  {
    id: 'macos',
    label: 'macOS',
    patch: {
      controls: 'mac',
      controlsSide: 'left',
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
    patch: {
      controls: 'windows',
      controlsSide: 'right',
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

const pixisDefaults = {
  borderRadius: 20,
  containerWidth: 900,
  containerHeight: 600,
  containerPadding: 10,
  containerBorderRadius: 20,
  aspectRatio: 'default',
  exportScale: 5,
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
    subtitle: 'Detalles visuales del shot: radio y tamaño.',
    panel: true
  }
] satisfies PreferenceGroup[]

export const pixisPreferenceFields = {
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
    default: pixisDefaults.aspectRatio
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
  }),
  exportScale: field({
    id: 'exportScale',
    groupId: 'pixis',
    path: 'pixis.exportScale',
    kind: 'number',
    title: 'Calidad de imagen',
    subtitle: 'Escala al descargar o copiar',
    description: 'Multiplica la resolución del PNG exportado.',
    example: 'Ej: x5 = buena calidad; x10 = máxima (más pesado)',
    note: 'Valores altos tardan más y generan archivos más grandes.',
    default: pixisDefaults.exportScale,
    options: [4, 5, 6, 7, 8, 9, 10],
    min: 4,
    max: 10,
    step: 1
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
