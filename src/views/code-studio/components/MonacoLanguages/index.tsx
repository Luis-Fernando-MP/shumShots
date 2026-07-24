import monacoLanguagesIcons from '@/shared/monaco-languages'
import type { FC } from 'react'

import MonacoLanguage from './MonacoLanguage'

const MonacoLanguages: FC = () => {
  return (
    <div className='flex flex-col gap-3'>
      {Object.entries(monacoLanguagesIcons).map(([section, languages]) => (
        <MonacoLanguage key={section} language={[section, languages]} />
      ))}
    </div>
  )
}

export default MonacoLanguages
