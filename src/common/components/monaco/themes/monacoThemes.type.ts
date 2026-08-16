type ThemeRule = {
  background?: string
  foreground?: string
  fontStyle?: 'italic' | 'bold' | 'underline'
  token: string
}

export type ThemeColors = {
  'editor.foreground': string
  'editor.background': string
  'editor.selectionBackground': string
  'editor.lineHighlightBackground': string
  'editorCursor.foreground': string
  'editorWhitespace.foreground': string
  'editor.selectionHighlightBackground': string
  'activityBarBadge.background': string
}

type Theme = {
  base: string
  inherit: boolean
  rules: ThemeRule[]
  colors: ThemeColors
}

export type ThemeMonaco = {
  base: string
  inherit: boolean
  rules: ThemeRule[]
  colors: ThemeColors
  default: Theme
}
