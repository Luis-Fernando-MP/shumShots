import { newKey } from '@/shared/key'
import monacoLanguagesIcons from '@/shared/monaco-languages'
import type { FC } from 'react'

import MonacoLanguage from './MonacoLanguage'

const MonacoLanguages: FC = () => {
  return (
    <>
      {Object.entries(monacoLanguagesIcons).map(language => {
        return <MonacoLanguage key={newKey()} language={language} />
      })}
    </>
  )
}

export default MonacoLanguages
