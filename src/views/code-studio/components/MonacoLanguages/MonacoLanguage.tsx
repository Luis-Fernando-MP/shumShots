import { MonacoLanguage as MonacoLanguageType } from '@/shared/monaco-languages'
import Typography from '@common/ui/Typography'
import useShumOptionsStore from '@views/code-studio/store/shumOptions.store'
import type { FC } from 'react'

import IconLanguage from './IconLanguage'

interface Props {
  language: [string, { [key: string]: { Icon: React.ElementType; language: string; short: string } }]
}

const MonacoLanguage: FC<Props> = ({ language }) => {
  const [section, languages] = language
  const { language: userLanguage, setLanguage } = useShumOptionsStore()

  const handleClick = (next: MonacoLanguageType) => {
    if (userLanguage.language === next.language) return
    setLanguage(next)
  }

  return (
    <div className='flex flex-col gap-1.5'>
      <Typography.Small weight='medium' className='text-muted-foreground tracking-wide uppercase'>
        {section}
      </Typography.Small>

      <div className='flex flex-row flex-wrap gap-1.5'>
        {Object.entries(languages).map(([key, languageProps]) => (
          <IconLanguage
            key={key}
            language={languageProps}
            onClick={handleClick}
            selected={userLanguage.language === languageProps.language}
          />
        ))}
      </div>
    </div>
  )
}

export default MonacoLanguage
