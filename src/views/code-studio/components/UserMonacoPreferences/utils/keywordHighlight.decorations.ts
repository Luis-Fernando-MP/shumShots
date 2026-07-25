import { SHUM_DEV } from '@/shared/constants'
import type { KeywordGlyphStyle, KeywordHighlightStyle } from '@views/code-studio/utils/preferences'
import type { editor } from 'monaco-editor'
import { Bookmark, Code2, Heart, Sparkles, Star, Zap, type LucideIcon } from 'lucide-react'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'

import { parseKeywordTerms } from './monaco.config'

const hoverMessage = `Te invito a visitar mi sitio web 👋: [HAUI](${SHUM_DEV})`

const STYLE_COLORS: Record<Exclude<KeywordHighlightStyle, 'primary'>, string> = {
  amber: '#e5c07b',
  blue: '#61afef',
  green: '#98c379',
  pink: '#c678dd'
}

export const KEYWORD_GLYPHS: readonly { id: KeywordGlyphStyle; Icon: LucideIcon | null }[] = [
  { id: 'none', Icon: null },
  { id: 'logo', Icon: null },
  { id: 'star', Icon: Star },
  { id: 'heart', Icon: Heart },
  { id: 'zap', Icon: Zap },
  { id: 'sparkles', Icon: Sparkles },
  { id: 'bookmark', Icon: Bookmark },
  { id: 'code', Icon: Code2 }
]

const resolvePrimaryColor = () => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--tn-primary').trim()
  return raw ? `rgb(${raw})` : '#c678dd'
}

const svgDataUrl = (Icon: LucideIcon, color: string) => {
  const svg = renderToStaticMarkup(createElement(Icon, { size: 24, color, strokeWidth: 2 }))
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const embedLogo = async (styleEl: HTMLStyleElement) => {
  try {
    const res = await fetch('/logo.webp')
    const blob = await res.blob()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    styleEl.textContent +=
      `.editorComponent .user-monaco-icon:not(.user-monaco-icon-lucide)::before{` +
      `background-image:url("${dataUrl}");background-size:cover;background-position:center;background-repeat:no-repeat}`
  } catch {
    /* CSS fallback /logo.webp */
  }
}

export const ensureKeywordGlyphStyles = () => {
  if (typeof document === 'undefined') return
  document.getElementById('pixis-keyword-glyphs')?.remove()

  const colors: Record<KeywordHighlightStyle, string> = {
    primary: resolvePrimaryColor(),
    ...STYLE_COLORS
  }

  let css = ''
  for (const { id, Icon } of KEYWORD_GLYPHS) {
    if (!Icon) continue
    for (const style of Object.keys(colors) as KeywordHighlightStyle[]) {
      css +=
        `.editorComponent .user-monaco-icon-${id}.user-monaco-icon-${style}::before{` +
        `background-image:${svgDataUrl(Icon, colors[style])};background-color:transparent}`
    }
  }

  const styleEl = document.createElement('style')
  styleEl.id = 'pixis-keyword-glyphs'
  styleEl.textContent = css
  document.head.appendChild(styleEl)
  void embedLogo(styleEl)
}

export const buildKeywordDecorations = (model: editor.ITextModel): editor.IModelDeltaDecoration[] => {
  const { keywordHighlight, glyphMargin } = usePixisPreferencesStore.getState().monaco
  const decorations: editor.IModelDeltaDecoration[] = []

  for (const group of keywordHighlight.groups) {
    const glyph =
      !glyphMargin || group.glyph === 'none'
        ? undefined
        : group.glyph === 'logo'
          ? 'user-monaco-icon'
          : `user-monaco-icon user-monaco-icon-lucide user-monaco-icon-${group.glyph} user-monaco-icon-${group.style}`

    for (const term of parseKeywordTerms(group.terms)) {
      for (const match of model.findMatches(term, false, false, true, null, false)) {
        decorations.push({
          range: match.range,
          options: {
            inlineClassName: `user-monaco-highlight user-monaco-hl-${group.style}`,
            glyphMarginClassName: glyph,
            hoverMessage: { value: hoverMessage, isTrusted: true }
          }
        })
      }
    }
  }

  return decorations
}
