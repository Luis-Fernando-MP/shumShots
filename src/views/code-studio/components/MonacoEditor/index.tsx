'use client'

import dynamic from 'next/dynamic'
import { type FC, memo } from 'react'

import useMonacoThemeStore from '../../store/monacoTheme.store'
import ShotFileName from './ShotFileName'

const EditorComponent = dynamic(() => import('../EditorComponent'), { ssr: false })

const MonacoEditor: FC = () => {
  const { getCurrentTheme } = useMonacoThemeStore()

  const theme = getCurrentTheme()

  return (
    <article
      className='flex aspect-[3/2] h-[600px] w-[900px] flex-col overflow-hidden rounded-radius bg-background pt-grid pb-grid-lg'
      style={{ backgroundColor: theme?.colors['editor.background'] }}
      id='monacoEditor'
    >
      <header className='flex items-center gap-grid-xl'>
        <div className='flex items-center gap-grid-sm pl-grid-xl'>
          <span className='size-4 rounded-full bg-[#ff605c]' />
          <span className='size-4 rounded-full bg-[#ffbd44]' />
          <span className='size-4 rounded-full bg-[#00ca4e]' />
        </div>

        <ShotFileName foreground={theme?.colors['editor.foreground']} />
      </header>
      <EditorComponent />
    </article>
  )
}

export default memo(MonacoEditor)
