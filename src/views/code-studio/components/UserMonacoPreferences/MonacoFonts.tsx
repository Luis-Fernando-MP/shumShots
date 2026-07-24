import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import useShumOptionsStore from '@views/code-studio/store/shumOptions.store'
import dynamic from 'next/dynamic'
import type { FC } from 'react'

const TypographyDisplay = dynamic(() => import('@views/code-studio/ui/TypographyDisplay'), { ssr: false })

const MonacoFonts: FC = () => {
  const { setTypography, typography } = useShumOptionsStore()

  return (
    <>
      {Object.entries(monacoFonts).map(([name, font]) => {
        const fontFamily = font.style.fontFamily
        return (
          <TypographyDisplay
            key={name}
            font={font}
            title={name}
            onClick={() => setTypography(fontFamily)}
            selected={typography === fontFamily}
          />
        )
      })}
    </>
  )
}

export default MonacoFonts
