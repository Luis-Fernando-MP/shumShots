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

export const THEMES: Record<string, Theme> = {
  'Geist Light': defineTheme({
    'bg-primary': '255, 255, 255',
    'bg-secondary': '250, 250, 250',
    'bg-tertiary': '244, 244, 245',
    'fnt-primary': '10, 10, 10',
    'fnt-secondary': '113, 113, 122',
    'tn-primary': '0, 0, 0',
    'tn-secondary': '82, 82, 91'
  }),
  'Geist Dark': defineTheme({
    'bg-primary': '0, 0, 0',
    'bg-secondary': '10, 10, 10',
    'bg-tertiary': '23, 23, 23',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '161, 161, 170',
    'tn-primary': '255, 255, 255',
    'tn-secondary': '161, 161, 170'
  }),
  'Aurora Day': defineTheme({
    'bg-primary': '232, 228, 255',
    'bg-secondary': '212, 204, 255',
    'bg-tertiary': '188, 176, 250',
    'fnt-primary': '32, 20, 72',
    'fnt-secondary': '96, 72, 160',
    'tn-primary': '255, 56, 140',
    'tn-secondary': '160, 96, 255'
  }),
  'Pastel Horizon': defineTheme({
    'bg-primary': '244, 212, 255',
    'bg-secondary': '232, 184, 252',
    'bg-tertiary': '216, 156, 244',
    'fnt-primary': '56, 16, 80',
    'fnt-secondary': '128, 64, 168',
    'tn-primary': '196, 48, 232',
    'tn-secondary': '255, 96, 200'
  }),
  Cloud: defineTheme({
    'bg-primary': '186, 224, 255',
    'bg-secondary': '156, 208, 255',
    'bg-tertiary': '124, 188, 255',
    'fnt-primary': '8, 32, 80',
    'fnt-secondary': '32, 88, 168',
    'tn-primary': '0, 122, 255',
    'tn-secondary': '0, 184, 255'
  }),
  Pearl: defineTheme({
    'bg-primary': '255, 228, 228',
    'bg-secondary': '255, 208, 208',
    'bg-tertiary': '255, 184, 188',
    'fnt-primary': '72, 24, 32',
    'fnt-secondary': '160, 72, 80',
    'tn-primary': '255, 72, 96',
    'tn-secondary': '255, 128, 140'
  }),
  Candy: defineTheme({
    'bg-primary': '255, 176, 204',
    'bg-secondary': '255, 148, 188',
    'bg-tertiary': '255, 120, 172',
    'fnt-primary': '80, 16, 48',
    'fnt-secondary': '160, 40, 96',
    'tn-primary': '255, 40, 112',
    'tn-secondary': '255, 80, 176'
  }),
  'Cotton Candy': defineTheme({
    'bg-primary': '255, 172, 228',
    'bg-secondary': '255, 144, 212',
    'bg-tertiary': '255, 116, 196',
    'fnt-primary': '80, 16, 64',
    'fnt-secondary': '160, 48, 128',
    'tn-primary': '255, 64, 176',
    'tn-secondary': '255, 112, 208'
  }),
  'Rose Quartz': defineTheme({
    'bg-primary': '255, 186, 198',
    'bg-secondary': '255, 160, 178',
    'bg-tertiary': '255, 132, 158',
    'fnt-primary': '72, 20, 40',
    'fnt-secondary': '152, 48, 80',
    'tn-primary': '255, 64, 112',
    'tn-secondary': '255, 112, 144'
  }),
  Lavender: defineTheme({
    'bg-primary': '216, 188, 255',
    'bg-secondary': '196, 164, 255',
    'bg-tertiary': '172, 140, 248',
    'fnt-primary': '48, 16, 88',
    'fnt-secondary': '104, 56, 168',
    'tn-primary': '132, 64, 255',
    'tn-secondary': '176, 120, 255'
  }),
  'Lavender Gray': defineTheme({
    'bg-primary': '212, 212, 240',
    'bg-secondary': '192, 192, 228',
    'bg-tertiary': '168, 168, 216',
    'fnt-primary': '40, 32, 80',
    'fnt-secondary': '96, 80, 160',
    'tn-primary': '140, 112, 255',
    'tn-secondary': '180, 160, 255'
  }),
  'Nebula Light': defineTheme({
    'bg-primary': '248, 188, 255',
    'bg-secondary': '232, 160, 248',
    'bg-tertiary': '216, 132, 236',
    'fnt-primary': '64, 16, 80',
    'fnt-secondary': '136, 48, 160',
    'tn-primary': '208, 40, 232',
    'tn-secondary': '255, 88, 220'
  }),
  'Soft Pink': defineTheme({
    'bg-primary': '255, 180, 180',
    'bg-secondary': '255, 156, 156',
    'bg-tertiary': '255, 128, 128',
    'fnt-primary': '80, 16, 24',
    'fnt-secondary': '160, 48, 56',
    'tn-primary': '255, 64, 80',
    'tn-secondary': '255, 112, 120'
  }),
  'Pastel Pink': defineTheme({
    'bg-primary': '255, 208, 212',
    'bg-secondary': '255, 180, 188',
    'bg-tertiary': '255, 152, 164',
    'fnt-primary': '80, 24, 32',
    'fnt-secondary': '168, 64, 80',
    'tn-primary': '255, 96, 120',
    'tn-secondary': '255, 140, 156'
  }),
  Almond: defineTheme({
    'bg-primary': '255, 220, 168',
    'bg-secondary': '252, 196, 132',
    'bg-tertiary': '244, 172, 96',
    'fnt-primary': '72, 40, 8',
    'fnt-secondary': '152, 88, 24',
    'tn-primary': '232, 112, 16',
    'tn-secondary': '255, 168, 48'
  }),
  Citrus: defineTheme({
    'bg-primary': '255, 236, 120',
    'bg-secondary': '255, 212, 72',
    'bg-tertiary': '255, 188, 32',
    'fnt-primary': '64, 40, 0',
    'fnt-secondary': '160, 96, 0',
    'tn-primary': '255, 140, 0',
    'tn-secondary': '255, 184, 0'
  }),
  'Sunny Meadow': defineTheme({
    'bg-primary': '212, 244, 140',
    'bg-secondary': '188, 232, 104',
    'bg-tertiary': '160, 216, 72',
    'fnt-primary': '24, 56, 8',
    'fnt-secondary': '72, 120, 24',
    'tn-primary': '255, 176, 0',
    'tn-secondary': '96, 196, 16'
  }),
  Emerald: defineTheme({
    'bg-primary': '132, 228, 176',
    'bg-secondary': '96, 212, 152',
    'bg-tertiary': '56, 192, 128',
    'fnt-primary': '0, 48, 28',
    'fnt-secondary': '0, 112, 68',
    'tn-primary': '0, 176, 96',
    'tn-secondary': '0, 220, 128'
  }),
  'Passionate Red': defineTheme({
    'bg-primary': '255, 132, 176',
    'bg-secondary': '255, 104, 156',
    'bg-tertiary': '255, 76, 136',
    'fnt-primary': '80, 8, 32',
    'fnt-secondary': '160, 24, 64',
    'tn-primary': '255, 24, 80',
    'tn-secondary': '255, 72, 120'
  }),
  'Sunrise Glow': defineTheme({
    'bg-primary': '255, 184, 120',
    'bg-secondary': '255, 156, 88',
    'bg-tertiary': '255, 128, 56',
    'fnt-primary': '72, 28, 0',
    'fnt-secondary': '160, 64, 16',
    'tn-primary': '255, 80, 16',
    'tn-secondary': '255, 140, 40'
  }),
  'Icy Blue': defineTheme({
    'bg-primary': '160, 216, 255',
    'bg-secondary': '128, 196, 255',
    'bg-tertiary': '96, 176, 252',
    'fnt-primary': '0, 32, 80',
    'fnt-secondary': '16, 80, 168',
    'tn-primary': '0, 112, 255',
    'tn-secondary': '32, 168, 255'
  }),
  'Marble White': defineTheme({
    'bg-primary': '244, 244, 246',
    'bg-secondary': '232, 232, 236',
    'bg-tertiary': '216, 216, 222',
    'fnt-primary': '16, 16, 20',
    'fnt-secondary': '72, 72, 84',
    'tn-primary': '0, 0, 0',
    'tn-secondary': '64, 64, 80'
  }),
  'Obsidian Black': defineTheme({
    'bg-primary': '10, 10, 16',
    'bg-secondary': '22, 22, 36',
    'bg-tertiary': '38, 38, 58',
    'fnt-primary': '255, 255, 255',
    'fnt-secondary': '160, 176, 255',
    'tn-primary': '255, 255, 255',
    'tn-secondary': '120, 168, 255'
  }),
  'Ebony Elegance': defineTheme({
    'bg-primary': '36, 18, 6',
    'bg-secondary': '56, 30, 10',
    'bg-tertiary': '80, 44, 14',
    'fnt-primary': '255, 236, 200',
    'fnt-secondary': '232, 176, 96',
    'tn-primary': '255, 184, 48',
    'tn-secondary': '255, 140, 24'
  }),
  DeepOcean: defineTheme({
    'bg-primary': '0, 28, 64',
    'bg-secondary': '0, 48, 96',
    'bg-tertiary': '0, 72, 132',
    'fnt-primary': '220, 248, 255',
    'fnt-secondary': '64, 196, 255',
    'tn-primary': '0, 220, 255',
    'tn-secondary': '48, 160, 255'
  }),
  AshMountains: defineTheme({
    'bg-primary': '32, 28, 44',
    'bg-secondary': '48, 42, 68',
    'bg-tertiary': '68, 60, 96',
    'fnt-primary': '244, 240, 255',
    'fnt-secondary': '176, 160, 255',
    'tn-primary': '168, 136, 255',
    'tn-secondary': '216, 196, 255'
  }),
  StarryNight: defineTheme({
    'bg-primary': '8, 4, 40',
    'bg-secondary': '20, 12, 72',
    'bg-tertiary': '36, 24, 108',
    'fnt-primary': '240, 236, 255',
    'fnt-secondary': '168, 152, 255',
    'tn-primary': '152, 128, 255',
    'tn-secondary': '255, 212, 64'
  }),
  'Twilight Purple': defineTheme({
    'bg-primary': '28, 0, 56',
    'bg-secondary': '52, 8, 96',
    'bg-tertiary': '80, 16, 140',
    'fnt-primary': '248, 236, 255',
    'fnt-secondary': '196, 152, 255',
    'tn-primary': '160, 64, 255',
    'tn-secondary': '216, 128, 255'
  }),
  'Dark Slate': defineTheme({
    'bg-primary': '16, 24, 40',
    'bg-secondary': '28, 40, 64',
    'bg-tertiary': '44, 60, 92',
    'fnt-primary': '236, 244, 255',
    'fnt-secondary': '96, 176, 255',
    'tn-primary': '0, 152, 255',
    'tn-secondary': '64, 200, 255'
  }),
  Carbon: defineTheme({
    'bg-primary': '4, 16, 12',
    'bg-secondary': '8, 36, 24',
    'bg-tertiary': '16, 60, 40',
    'fnt-primary': '220, 255, 236',
    'fnt-secondary': '64, 232, 168',
    'tn-primary': '0, 255, 152',
    'tn-secondary': '0, 232, 200'
  }),
  Circuit: defineTheme({
    'bg-primary': '0, 16, 36',
    'bg-secondary': '0, 32, 60',
    'bg-tertiary': '0, 52, 92',
    'fnt-primary': '220, 255, 255',
    'fnt-secondary': '0, 220, 232',
    'tn-primary': '0, 255, 220',
    'tn-secondary': '64, 255, 120'
  }),
  'Synth wave 84': defineTheme({
    'bg-primary': '24, 0, 52',
    'bg-secondary': '48, 0, 88',
    'bg-tertiary': '76, 8, 128',
    'fnt-primary': '255, 232, 255',
    'fnt-secondary': '200, 140, 255',
    'tn-primary': '255, 48, 176',
    'tn-secondary': '0, 236, 255'
  }),
  Nebula: defineTheme({
    'bg-primary': '36, 0, 52',
    'bg-secondary': '60, 0, 80',
    'bg-tertiary': '88, 8, 112',
    'fnt-primary': '255, 228, 255',
    'fnt-secondary': '232, 120, 255',
    'tn-primary': '255, 24, 160',
    'tn-secondary': '196, 64, 255'
  }),
  Eclipse: defineTheme({
    'bg-primary': '16, 6, 0',
    'bg-secondary': '36, 16, 0',
    'bg-tertiary': '60, 28, 0',
    'fnt-primary': '255, 240, 220',
    'fnt-secondary': '255, 176, 64',
    'tn-primary': '255, 132, 0',
    'tn-secondary': '255, 188, 32'
  }),
  'Forest Dawn': defineTheme({
    'bg-primary': '16, 28, 0',
    'bg-secondary': '28, 48, 0',
    'bg-tertiary': '44, 72, 0',
    'fnt-primary': '236, 255, 196',
    'fnt-secondary': '176, 220, 48',
    'tn-primary': '255, 176, 0',
    'tn-secondary': '168, 232, 16'
  }),
  'Forest Twilight': defineTheme({
    'bg-primary': '0, 28, 16',
    'bg-secondary': '0, 48, 28',
    'bg-tertiary': '0, 72, 44',
    'fnt-primary': '220, 255, 232',
    'fnt-secondary': '48, 220, 140',
    'tn-primary': '0, 232, 120',
    'tn-secondary': '64, 255, 168'
  }),
  Neon: defineTheme({
    'bg-primary': '4, 12, 4',
    'bg-secondary': '12, 28, 8',
    'bg-tertiary': '24, 48, 12',
    'fnt-primary': '236, 255, 220',
    'fnt-secondary': '160, 255, 64',
    'tn-primary': '168, 255, 0',
    'tn-secondary': '0, 224, 255'
  }),
  Aurora: defineTheme({
    'bg-primary': '0, 28, 28',
    'bg-secondary': '0, 48, 48',
    'bg-tertiary': '0, 72, 68',
    'fnt-primary': '220, 255, 244',
    'fnt-secondary': '48, 232, 200',
    'tn-primary': '0, 255, 168',
    'tn-secondary': '0, 196, 255'
  }),
  'Twilight Pink': defineTheme({
    'bg-primary': '44, 0, 28',
    'bg-secondary': '72, 0, 44',
    'bg-tertiary': '104, 8, 64',
    'fnt-primary': '255, 228, 240',
    'fnt-secondary': '255, 128, 176',
    'tn-primary': '255, 64, 144',
    'tn-secondary': '255, 128, 184'
  }),
  Velvet: defineTheme({
    'bg-primary': '32, 0, 48',
    'bg-secondary': '56, 0, 76',
    'bg-tertiary': '84, 8, 108',
    'fnt-primary': '252, 228, 255',
    'fnt-secondary': '224, 128, 255',
    'tn-primary': '255, 80, 196',
    'tn-secondary': '196, 80, 255'
  }),
  'Volcanic Magma': defineTheme({
    'bg-primary': '44, 4, 0',
    'bg-secondary': '72, 12, 0',
    'bg-tertiary': '104, 24, 0',
    'fnt-primary': '255, 228, 196',
    'fnt-secondary': '255, 148, 64',
    'tn-primary': '255, 64, 0',
    'tn-secondary': '255, 152, 16'
  }),
  Midnight: defineTheme({
    'bg-primary': '0, 12, 52',
    'bg-secondary': '0, 28, 88',
    'bg-tertiary': '0, 48, 128',
    'fnt-primary': '220, 236, 255',
    'fnt-secondary': '96, 160, 255',
    'tn-primary': '32, 112, 255',
    'tn-secondary': '80, 176, 255'
  })
}
