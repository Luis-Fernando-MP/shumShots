import { MonacoLanguage as MonacoLanguageType } from '@/shared/monaco-languages'
import Typography from '@common/ui/Typography'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore, { selectActiveFile } from '@views/code-studio/store/workspace.store'
import {
  getLanguageMetaFromFileName,
  replaceFileExtension
} from '@common/monaco'
import type { FC } from 'react'

import IconLanguage from './IconLanguage'

interface Props {
  language: [string, { [key: string]: { Icon: React.ElementType; language: string; short: string } }]
}

const MonacoLanguage: FC<Props> = ({ language }) => {
  const [section, languages] = language
  const setLanguage = usePixisPreferencesStore(s => s.setLanguage)
  const activeFile = useWorkspaceStore(selectActiveFile)
  const renameEntry = useWorkspaceStore(s => s.renameEntry)
  const activeMeta = activeFile ? getLanguageMetaFromFileName(activeFile.name) : null

  const handleClick = (next: MonacoLanguageType) => {
    if (activeFile && activeFile.kind === 'file') {
      const nextName = replaceFileExtension(activeFile.name, next.short)
      if (nextName !== activeFile.name) renameEntry(activeFile.id, nextName)
    }
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
            selected={Boolean(
              activeMeta &&
                activeMeta.short === languageProps.short &&
                activeMeta.language === languageProps.language
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default MonacoLanguage
