import {
  Anonymous_Pro,
  Azeret_Mono,
  Courier_Prime,
  DM_Mono,
  Fira_Code,
  Fragment_Mono,
  Geist_Mono,
  Inconsolata,
  JetBrains_Mono,
  Kode_Mono,
  Nanum_Gothic_Coding,
  Nova_Mono,
  Roboto_Mono,
  Sometype_Mono,
  Source_Code_Pro,
  Space_Mono,
  Ubuntu_Mono,
  VT323,
  Victor_Mono
} from 'next/font/google'

const sometype_Mono = Sometype_Mono({ subsets: ['latin'], weight: '400' })
const fragment_Mono = Fragment_Mono({ subsets: ['latin'], weight: '400' })
const jetBrains_Mono = JetBrains_Mono({ subsets: ['latin'], weight: '300' })
const anonymous_Pro = Anonymous_Pro({ subsets: ['latin'], weight: '400' })
const firaCode = Fira_Code({ subsets: ['latin'], weight: '400' })
const azeret_Mono = Azeret_Mono({ subsets: ['latin'], weight: '300' })
const dm_Mono = DM_Mono({ subsets: ['latin'], weight: '300' })
const victor_Mono = Victor_Mono({ subsets: ['latin'], weight: '300' })
const space_Mono = Space_Mono({ subsets: ['latin'], weight: '400' })
const source_Code_Pro = Source_Code_Pro({ subsets: ['latin'], weight: '400' })
const roboto_Mono = Roboto_Mono({ subsets: ['latin'], weight: '400' })
const inconsolata = Inconsolata({ subsets: ['latin'], weight: '400' })
const ubuntu_Mono = Ubuntu_Mono({ subsets: ['latin'], weight: '400' })
const courier_Prime = Courier_Prime({ subsets: ['latin'], weight: '400' })
const nanum_Gothic_Coding = Nanum_Gothic_Coding({ subsets: ['latin'], weight: '400' })
const vt323 = VT323({ subsets: ['latin'], weight: '400' })
const geist_Mono = Geist_Mono({ subsets: ['latin'], weight: '400' })
const nova_Mono = Nova_Mono({ subsets: ['latin'], weight: '400' })
const kode_Mono = Kode_Mono({ subsets: ['latin'], weight: '400' })

/** Catálogo único de tipografías monospace para Monaco / code-studio. */
export const monacoFonts = {
  monospace: space_Mono,
  victor_Mono,
  jetBrains_Mono,
  sometype_Mono,
  fragment_Mono,
  anonymous_Pro,
  firaCode,
  azeret_Mono,
  dm_Mono,
  source_Code_Pro,
  roboto_Mono,
  inconsolata,
  ubuntu_Mono,
  courier_Prime,
  nanum_Gothic_Coding,
  vt323,
  geist_Mono,
  nova_Mono,
  kode_Mono
}

export type MonacoFontId = keyof typeof monacoFonts

export const DEFAULT_MONACO_FONT_ID: MonacoFontId = 'monospace'

const quotedNames = (value: string) =>
  [...value.matchAll(/"([^"]+)"|'([^']+)'/g)].map(match => (match[1] ?? match[2]).toLowerCase())

const compact = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase()

export const isMonacoFontId = (value: string): value is MonacoFontId =>
  Object.prototype.hasOwnProperty.call(monacoFonts, value)

/** Resuelve un id persistido o un `font-family` legacy a la familia CSS actual. */
export const resolveMonacoFontFamily = (stored: string | undefined | null) => {
  if (!stored) return monacoFonts[DEFAULT_MONACO_FONT_ID].style.fontFamily
  if (isMonacoFontId(stored)) return monacoFonts[stored].style.fontFamily

  for (const font of Object.values(monacoFonts)) {
    if (font.style.fontFamily === stored) return stored
  }

  const storedQuoted = new Set(quotedNames(stored))
  for (const font of Object.values(monacoFonts)) {
    if (quotedNames(font.style.fontFamily).some(name => storedQuoted.has(name))) {
      return font.style.fontFamily
    }
  }

  const storedCompact = compact(stored)
  for (const [id, font] of Object.entries(monacoFonts)) {
    if (storedCompact.includes(compact(id))) return font.style.fontFamily
  }

  return monacoFonts[DEFAULT_MONACO_FONT_ID].style.fontFamily
}

/** Resuelve un valor persistido al id estable de tipografía Monaco. */
export const resolveMonacoFontId = (stored: string | undefined | null): MonacoFontId => {
  if (!stored) return DEFAULT_MONACO_FONT_ID
  if (isMonacoFontId(stored)) return stored

  const family = resolveMonacoFontFamily(stored)
  for (const [id, font] of Object.entries(monacoFonts) as [MonacoFontId, (typeof monacoFonts)[MonacoFontId]][]) {
    if (font.style.fontFamily === family) return id
  }

  return DEFAULT_MONACO_FONT_ID
}
