import { MonacoLanguage as MonacoLanguageType } from '@/shared/monaco-languages'
import type { FC } from 'react'

import useShumOptionsStore from '../../store/shumOptions.store'
import IconLanguage from './IconLanguage'
import Typography from '@common/ui/Typography'

interface Props {
  language: [string, { [key: string]: { Icon: React.ElementType; language: string; short: string } }]
}

const MonacoLanguage: FC<Props> = ({ language }) => {
  const [section, languages] = language
  const { language: userLanguage, setLanguage } = useShumOptionsStore()

  const handleClick = (language: MonacoLanguageType) => {
    if (userLanguage.language === language.language) return
    setLanguage(language)
  }

  return (
    <div className='monacoThemeCategory flex flex-col gap-grid-sm'>
      <Typography.Subheading tone='secondary'>{section}</Typography.Subheading>

      <div className='monacoThemeCategory-icons flex flex-row flex-wrap gap-grid-sm'>
        {Object.entries(languages).map(lang => {
          const [key, languageProps] = lang
          return (
            <IconLanguage
              key={key}
              language={languageProps}
              onClick={handleClick}
              selected={userLanguage.language === languageProps.language}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MonacoLanguage
