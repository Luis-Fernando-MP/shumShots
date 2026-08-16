'use client'

import Button from '@common/components/Button'
import ShotCapture from '@common/components/ShotCapture'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { LetterText } from 'lucide-react'
import type { FC } from 'react'

import useReferenceMonacoStore from '../../store/referenceMonaco'

const MainBarOptions: FC = () => {
  const { $editor } = useReferenceMonacoStore()
  const exportScale = usePixisPreferencesStore(s => s.pixis.exportScale ?? 5)

  const handleFormatCode = () => {
    if ($editor) {
      $editor.getAction('editor.action.formatDocument')?.run()
    }
  }

  return (
    <section className='gap-grid flex flex-row items-center'>
      <Button size='icon' tooltip='Formatear código' onClick={handleFormatCode}>
        <LetterText />
      </Button>

      <ShotCapture
        target='monacoEditor-container'
        alternateTarget='monacoEditor'
        scale={exportScale}
        missingTitle='No se encontró el editor'
        alternatePrompt={{
          description: 'Con el fondo del contenedor, o solo el editor.',
          primaryLabel: 'Con fondo',
          secondaryLabel: 'Sin fondo'
        }}
      />
    </section>
  )
}

export default MainBarOptions
