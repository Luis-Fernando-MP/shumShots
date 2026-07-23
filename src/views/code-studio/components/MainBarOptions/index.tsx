'use client'

import Button from '@/shared/ui/Button'
import { LetterText } from 'lucide-react'
import type { FC } from 'react'

import useReferenceMonacoStore from '../../store/referenceMonaco'
import UserMonacoPreferences from '../UserMonacoPreferences'
import ShotFileName from './ShotFileName'

const MainBarOptions: FC = () => {
  const { $editor } = useReferenceMonacoStore()

  const handleFormatCode = () => {
    if ($editor) {
      $editor.getAction('editor.action.formatDocument')?.run()
    }
  }

  return (
    <section className='flex flex-row items-center gap-grid'>
      <Button size='icon' tooltip='Formatear código' onClick={handleFormatCode}>
        <LetterText />
      </Button>
      <ShotFileName />
      <UserMonacoPreferences />
    </section>
  )
}

export default MainBarOptions
