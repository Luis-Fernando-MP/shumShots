import { ThemeMonacoName, monacoThemes, type ThemeMonaco } from '@common/components/monaco/themes/monacoThemes'
import Text from '@common/components/Text'
import { chromeFrame } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import type { FC } from 'react'

type TokenRule = { token?: string; foreground?: string }
type TokenColor = { scope?: string | string[]; settings?: { foreground?: string } }

const toHex = (value?: string) => {
  if (!value) return undefined
  return value.startsWith('#') ? value : `#${value}`
}

const fromRules = (rules: TokenRule[] | undefined, needles: string[]) => {
  if (!rules) return undefined
  for (const needle of needles) {
    const hit = rules.find(rule => rule.token?.toLowerCase().includes(needle) && rule.foreground)
    if (hit?.foreground) return toHex(hit.foreground)
  }
}

const fromTokenColors = (tokenColors: TokenColor[] | undefined, needles: string[]) => {
  if (!tokenColors) return undefined
  for (const needle of needles) {
    const hit = tokenColors.find(entry => {
      const scopes = Array.isArray(entry.scope) ? entry.scope : entry.scope ? [entry.scope] : []
      return scopes.some(scope => scope.toLowerCase().includes(needle)) && entry.settings?.foreground
    })
    if (hit?.settings?.foreground) return toHex(hit.settings.foreground)
  }
}

const syntaxOf = (theme: ThemeMonaco) => {
  const colors = (theme.colors ?? {}) as Record<string, string | undefined>
  const rules = (theme as { rules?: TokenRule[] }).rules
  const tokenColors = (theme as { tokenColors?: TokenColor[] }).tokenColors
  const pick = (needles: string[]) => fromRules(rules, needles) ?? fromTokenColors(tokenColors, needles)

  return {
    bg: colors['editor.background'] ?? '#1e1e1e',
    fg: colors['editor.foreground'] ?? '#d4d4d4',
    keyword: pick(['keyword']) ?? '#569cd6',
    string: pick(['string']) ?? '#ce9178',
    comment: pick(['comment']) ?? '#6a9955'
  }
}

const formatThemeName = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ')

const ThemeSelectorPreference: FC = () => {
  const { themeName, setThemeName } = useMonacoThemeStore()

  return (
    <>
      {Object.values(monacoThemes).map(theme => {
        const selected = theme.name === themeName
        const syntax = syntaxOf(theme)

        return (
          <button
            key={theme.name}
            type='button'
            aria-pressed={selected}
            onClick={() => setThemeName(theme.name as ThemeMonacoName)}
            className={cn('overflow-hidden text-left', chromeFrame(selected))}
          >
            <div
              className='px-2 py-1.5 font-mono text-[9px] leading-3.5'
              style={{ backgroundColor: syntax.bg, color: syntax.fg }}
            >
              <div>
                <span style={{ color: syntax.comment }}>{'// shot'}</span>
              </div>
              <div>
                <span style={{ color: syntax.keyword }}>const </span>
                <span style={{ color: syntax.string }}>'pixis'</span>
              </div>
            </div>
            <div className='px-2 py-1'>
              <Text.emphasis className='block truncate'>{formatThemeName(theme.name)}</Text.emphasis>
            </div>
          </button>
        )
      })}
    </>
  )
}

export default ThemeSelectorPreference
