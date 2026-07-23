import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import monacoLanguagesIcons from '@/shared/monaco-languages'

export const defaultShumOptions = {
  language: monacoLanguagesIcons['Frontend Web'].typescript,
  typography: monacoFonts.monospace.style.fontFamily,
  showLanguageIcon: true,

  shadowLanguage: false,
  borderRadius: 20,
  containerWidth: 900,
  containerHeight: 600,
  containerPadding: 10,
  containerBorderRadius: 20
}
