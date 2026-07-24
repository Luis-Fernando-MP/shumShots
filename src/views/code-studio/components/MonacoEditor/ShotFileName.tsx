import type { ChangeEvent, FC } from 'react'
import { Input } from 'react-field-sizing-content'
import { useDebounceCallback } from 'usehooks-ts'

import useCodeShotStore from '../../store/codeShot.store'
import usePixisPreferencesStore from '../../store/pixisPreferences.store'

interface Props {
  foreground: string
}

const ShotFileName: FC<Props> = ({ foreground }) => {
  const { fileName, setFileName } = useCodeShotStore()
  const language = usePixisPreferencesStore(s => s.pixis.language)
  const showLanguageIcon = usePixisPreferencesStore(s => s.pixis.showLanguageIcon)
  const shadowLanguage = usePixisPreferencesStore(s => s.pixis.shadowLanguage)

  const debouncedSetFileName = useDebounceCallback(setFileName, 500)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetFileName(e.target.value)
  }
  const disableFilter = { filter: 'none' }

  return (
    <div className='flex flex-row items-center justify-center gap-0 [&_input]:max-w-[300px] [&_input]:bg-transparent'>
      {showLanguageIcon && (
        <div
          className='mr-grid size-4 drop-shadow-[0_0_5px_rgb(var(--fnt-primary))] [&_.icon]:size-full'
          style={!shadowLanguage ? disableFilter : {}}
        >
          <language.Icon />
        </div>
      )}
      <Input fieldSizing='content' defaultValue={fileName} style={{ color: foreground }} onChange={handleChange} />
      <p className='select-none opacity-80' style={{ color: foreground }}>
        .{language.short}
      </p>
    </div>
  )
}

export default ShotFileName
