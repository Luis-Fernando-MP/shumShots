'use client'

import { languageIdFromFileName } from '@common/monaco'
import { cn } from '@common/utils/cn'
import useReferenceMonacoStore from '@views/code-studio/store/referenceMonaco'
import useWorkspaceStore, { selectActiveFile } from '@views/code-studio/store/workspace.store'
import type { StatusBarDensity } from '@views/code-studio/components/UserPixisPreferences/utils'
import { FileTypeIcon } from '@views/code-studio/components/workspaceIcons'
import { type FC, useEffect, useState } from 'react'

interface StatusBarProps {
  foreground?: string
  background?: string
  className?: string
  density?: StatusBarDensity
}

const countLines = (content: string) => {
  if (!content) return 1
  return Math.max(1, content.split(/\r\n|\r|\n/).length)
}

export const StatusBar: FC<StatusBarProps> = ({
  foreground,
  background,
  className,
  density = 'full'
}) => {
  const activeFile = useWorkspaceStore(selectActiveFile)
  const $editor = useReferenceMonacoStore(s => s.$editor)
  const [cursor, setCursor] = useState({ line: 1, column: 1 })

  const language = activeFile ? languageIdFromFileName(activeFile.name) : 'typescript'
  const lineCount = countLines(activeFile?.content ?? '')
  const compact = density === 'compact'

  useEffect(() => {
    if (!$editor) return

    const sync = () => {
      const position = $editor.getPosition()
      if (!position) return
      setCursor({ line: position.lineNumber, column: position.column })
    }

    sync()
    const disposable = $editor.onDidChangeCursorPosition(sync)
    return () => disposable.dispose()
  }, [$editor, activeFile?.id])

  return (
    <footer
      className={cn(
        'flex h-[22px] shrink-0 items-center justify-between gap-3 px-3 text-[11px] leading-none select-none',
        className
      )}
      style={{
        color: foreground,
        backgroundColor: background
          ? `color-mix(in oklab, ${background} 88%, black)`
          : undefined
      }}
      aria-hidden
    >
      <div className='flex min-w-0 items-center gap-2.5 opacity-80'>
        {activeFile && <FileTypeIcon fileName={activeFile.name} className='opacity-90' />}
        <span className='truncate'>{activeFile?.name ?? 'pixis.ts'}</span>
        {!compact && <span className='opacity-70'>{language}</span>}
      </div>
      <div className='flex shrink-0 items-center gap-3 opacity-80'>
        <span>
          Ln {cursor.line}, Col {cursor.column}
        </span>
        <span>{lineCount} lines</span>
        {!compact && (
          <>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
          </>
        )}
      </div>
    </footer>
  )
}
