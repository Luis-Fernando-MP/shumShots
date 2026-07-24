'use client'

import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

const TypographyDisplay = dynamic(() => import('@views/code-studio/ui/TypographyDisplay'), { ssr: false })

const formatFontName = (key: string) =>
  key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, char => char.toUpperCase())

const MonacoFonts: FC = () => {
  const typography = usePixisPreferencesStore(s => s.pixis.typography)
  const setTypography = usePixisPreferencesStore(s => s.setTypography)

  return (
    <div className='grid w-full grid-cols-2 gap-1.5 sm:grid-cols-3'>
      {Object.entries(monacoFonts).map(([name, font]) => {
        const fontFamily = font.style.fontFamily
        const selected = typography === fontFamily

        return (
          <TypographyDisplay
            key={name}
            font={font}
            title={formatFontName(name)}
            selected={selected}
            onClick={() => setTypography(fontFamily)}
            aria-label={`Tipografía ${formatFontName(name)}`}
          />
        )
      })}
    </div>
  )
}

export default MonacoFonts
