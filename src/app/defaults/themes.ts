export interface Theme {
  'bg-primary': string
  'bg-secondary': string
  'bg-tertiary': string
  'fnt-primary': string
  'fnt-secondary': string
  'fnt-active': string
  'tn-primary': string
  'tn-secondary': string
  'tn-border': string
  'semantic-primary': string
  'semantic-success': string
  'semantic-success-text': string
  'semantic-warning': string
  'semantic-warning-text': string
  'semantic-error': string
  'semantic-error-text': string
  'semantic-info': string
  'semantic-info-text': string
}

export type ThemeKeys = keyof typeof THEMES

type ThemeBase = Omit<
  Theme,
  | 'tn-border'
  | 'fnt-active'
  | 'semantic-primary'
  | 'semantic-success'
  | 'semantic-success-text'
  | 'semantic-warning'
  | 'semantic-warning-text'
  | 'semantic-error'
  | 'semantic-error-text'
  | 'semantic-info'
  | 'semantic-info-text'
> & {
  'fnt-active'?: string
}

type ThemeStatus = Pick<
  Theme,
  | 'semantic-success'
  | 'semantic-success-text'
  | 'semantic-warning'
  | 'semantic-warning-text'
  | 'semantic-error'
  | 'semantic-error-text'
  | 'semantic-info'
  | 'semantic-info-text'
>

type ThemeSemantic = ThemeStatus & Pick<Theme, 'semantic-primary' | 'tn-border' | 'fnt-active'>

const STATUS_LIGHT = {
  'semantic-success': '22, 163, 74',
  'semantic-success-text': '255, 255, 255',
  'semantic-warning': '217, 119, 6',
  'semantic-warning-text': '255, 255, 255',
  'semantic-error': '220, 38, 38',
  'semantic-error-text': '255, 255, 255',
  'semantic-info': '37, 99, 235',
  'semantic-info-text': '255, 255, 255'
} as const satisfies ThemeStatus

const STATUS_DARK = {
  'semantic-success': '74, 222, 128',
  'semantic-success-text': '6, 24, 14',
  'semantic-warning': '251, 191, 36',
  'semantic-warning-text': '30, 20, 0',
  'semantic-error': '248, 113, 113',
  'semantic-error-text': '40, 10, 16',
  'semantic-info': '96, 165, 250',
  'semantic-info-text': '8, 24, 48'
} as const satisfies ThemeStatus

const luminance = (rgb: string): number => {
  const [r, g, b] = rgb.split(',').map(value => Number(value.trim()))
  return 0.299 * r + 0.587 * g + 0.114 * b
}

const mixToward = (from: string, to: string, amount: number): string => {
  const [fr, fg, fb] = from.split(',').map(value => Number(value.trim()))
  const [tr, tg, tb] = to.split(',').map(value => Number(value.trim()))
  return [
    Math.round(fr + (tr - fr) * amount),
    Math.round(fg + (tg - fg) * amount),
    Math.round(fb + (tb - fb) * amount)
  ].join(', ')
}

const primaryContrast = (tnPrimary: string): string =>
  luminance(tnPrimary) > 140 ? '17, 17, 17' : '255, 255, 255'

const borderTone = (base: ThemeBase): string =>
  mixToward(base['bg-secondary'], base['fnt-primary'], luminance(base['bg-primary']) > 140 ? 0.18 : 0.28)

/**
 * Compone un tema PIXIS a partir de superficies, texto y acentos.
 *
 * Completa borde, contraste sobre el acento y estados semánticos según
 * la luminancia del fondo. `tn-primary` es el color puro del tema:
 * acciones, foco y el carácter de la paleta.
 *
 * @param base Superficies, tipografía y acentos en triplets `r, g, b`.
 * @param semantic Overrides opcionales de borde o estados.
 * @returns Tema completo listo para inyectar en `--*` del `<html>`.
 * @example
 * defineTheme({
 *   'bg-primary': '255, 255, 255',
 *   'bg-secondary': '250, 250, 250',
 *   'bg-tertiary': '244, 244, 245',
 *   'fnt-primary': '10, 10, 10',
 *   'fnt-secondary': '113, 113, 122',
 *   'tn-primary': '23, 23, 23',
 *   'tn-secondary': '82, 82, 91'
 * })
 */
export const defineTheme = (base: ThemeBase, semantic?: Partial<ThemeSemantic>): Theme => {
  const defaults = luminance(base['bg-primary']) > 140 ? STATUS_LIGHT : STATUS_DARK
  const onAccent = base['fnt-active'] ?? primaryContrast(base['tn-primary'])
  return {
    ...base,
    ...defaults,
    'fnt-active': onAccent,
    'tn-border': borderTone(base),
    'semantic-primary': primaryContrast(base['tn-primary']),
    ...semantic
  }
}

export const FEATURED_THEME_KEYS = ['Geist Light', 'Geist Dark'] as const

export const isLightTheme = (theme: Pick<Theme, 'bg-primary'>): boolean => luminance(theme['bg-primary']) > 140

const quietDark = (accent: string, companion: string): Theme =>
  defineTheme({
    'bg-primary': mixToward('4, 4, 6', accent, 0.05),
    'bg-secondary': mixToward('14, 14, 16', accent, 0.07),
    'bg-tertiary': mixToward('26, 26, 30', accent, 0.1),
    'fnt-primary': '248, 248, 250',
    'fnt-secondary': mixToward('148, 148, 156', accent, 0.12),
    'tn-primary': accent,
    'tn-secondary': companion
  })

const quietLight = (accent: string, companion: string): Theme =>
  defineTheme({
    'bg-primary': mixToward('255, 255, 255', accent, 0.035),
    'bg-secondary': mixToward('250, 250, 250', accent, 0.05),
    'bg-tertiary': mixToward('244, 244, 245', accent, 0.07),
    'fnt-primary': mixToward('16, 16, 18', accent, 0.08),
    'fnt-secondary': mixToward('113, 113, 122', accent, 0.1),
    'tn-primary': accent,
    'tn-secondary': companion
  })

export const THEMES: Record<string, Theme> = {
  'Geist Light': defineTheme({
    'bg-primary': '255, 255, 255',
    'bg-secondary': '250, 250, 250',
    'bg-tertiary': '244, 244, 245',
    'fnt-primary': '10, 10, 10',
    'fnt-secondary': '113, 113, 122',
    'tn-primary': '23, 23, 23',
    'tn-secondary': '82, 82, 91'
  }),
  'Geist Dark': defineTheme({
    'bg-primary': '0, 0, 0',
    'bg-secondary': '12, 12, 14',
    'bg-tertiary': '24, 24, 28',
    'fnt-primary': '250, 250, 250',
    'fnt-secondary': '161, 161, 170',
    'tn-primary': '250, 250, 250',
    'tn-secondary': '140, 140, 148'
  }),
  'Aurora Day': quietLight('255, 56, 140', '160, 96, 255'),
  'Pastel Horizon': quietLight('196, 48, 232', '255, 96, 200'),
  Cloud: quietLight('0, 122, 255', '0, 184, 255'),
  Pearl: quietLight('255, 72, 96', '255, 128, 140'),
  Candy: quietLight('255, 40, 112', '255, 80, 176'),
  'Cotton Candy': quietLight('255, 64, 176', '255, 112, 208'),
  'Rose Quartz': quietLight('255, 64, 112', '255, 112, 144'),
  Lavender: quietLight('132, 64, 255', '176, 120, 255'),
  'Lavender Gray': quietLight('140, 112, 255', '180, 160, 255'),
  'Nebula Light': quietLight('208, 40, 232', '255, 88, 220'),
  'Soft Pink': quietLight('255, 64, 80', '255, 112, 120'),
  'Pastel Pink': quietLight('255, 96, 120', '255, 140, 156'),
  Almond: quietLight('232, 112, 16', '255, 168, 48'),
  Citrus: quietLight('255, 140, 0', '255, 184, 0'),
  'Sunny Meadow': quietLight('96, 196, 16', '255, 176, 0'),
  Emerald: quietLight('0, 176, 96', '0, 220, 128'),
  'Passionate Red': quietLight('255, 24, 80', '255, 72, 120'),
  'Sunrise Glow': quietLight('255, 80, 16', '255, 140, 40'),
  'Icy Blue': quietLight('0, 112, 255', '32, 168, 255'),
  'Marble White': quietLight('0, 0, 0', '64, 64, 80'),
  'Obsidian Black': quietDark('255, 255, 255', '120, 168, 255'),
  'Ebony Elegance': quietDark('255, 184, 48', '255, 140, 24'),
  DeepOcean: quietDark('0, 220, 255', '48, 160, 255'),
  AshMountains: quietDark('168, 136, 255', '216, 196, 255'),
  StarryNight: quietDark('152, 128, 255', '255, 212, 64'),
  'Twilight Purple': quietDark('160, 64, 255', '216, 128, 255'),
  'Dark Slate': quietDark('0, 152, 255', '64, 200, 255'),
  Carbon: quietDark('0, 255, 152', '0, 232, 200'),
  Circuit: quietDark('0, 255, 220', '64, 255, 120'),
  'Synth wave 84': quietDark('255, 48, 176', '0, 236, 255'),
  Nebula: quietDark('255, 24, 160', '196, 64, 255'),
  Eclipse: quietDark('255, 132, 0', '255, 188, 32'),
  'Forest Dawn': quietDark('255, 176, 0', '168, 232, 16'),
  'Forest Twilight': quietDark('0, 232, 120', '64, 255, 168'),
  Neon: quietDark('168, 255, 0', '0, 224, 255'),
  Aurora: quietDark('0, 255, 168', '0, 196, 255'),
  'Twilight Pink': quietDark('255, 64, 144', '255, 128, 184'),
  Velvet: quietDark('255, 80, 196', '196, 80, 255'),
  'Volcanic Magma': quietDark('255, 64, 0', '255, 152, 16'),
  Midnight: quietDark('32, 112, 255', '80, 176, 255')
}
