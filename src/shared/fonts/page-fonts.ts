import { Roboto, Roboto_Condensed } from 'next/font/google'

export const fontSans = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap'
})

export const fontDisplay = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-condensed',
  display: 'swap'
})

export const bodyFonts = `${fontSans.variable} ${fontDisplay.variable}`
