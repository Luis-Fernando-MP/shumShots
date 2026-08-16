import { Plus_Jakarta_Sans } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'

export const fontSans = GeistSans

export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display-family',
  display: 'swap'
})

export const bodyFonts = `${fontSans.variable} ${fontDisplay.variable}`
