import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

import useShumOptionsStore from '../../store/shumOptions.store'

const TypographyDisplay = dynamic(() => import('../../ui/TypographyDisplay'), { ssr: false })

const MonacoFonts: FC = () => {
  const { setTypography, typography } = useShumOptionsStore()

  const handleClick = (fontFamily: string): void => {
    setTypography(fontFamily)
  }

  return (
    <>
      {Object.entries(monacoFonts).map(([name, font]) => {
        const fontFamily = font.style.fontFamily
        return (
          <TypographyDisplay
            key={name}
            font={font}
            title={name}
            onClick={() => handleClick(fontFamily)}
            selected={typography === fontFamily}
          />
        )
      })}
    </>
  )
}

export default MonacoFonts
