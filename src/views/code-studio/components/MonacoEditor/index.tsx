'use client'

import { cn } from '@common/utils/cn'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import { chromeDefaults } from '@views/code-studio/components/UserPixisPreferences/utils'
import dynamic from 'next/dynamic'
import { type CSSProperties, type FC, memo } from 'react'

import { ActivityBar } from './ActivityBar'
import { EditorBreadcrumb } from './EditorBreadcrumb'
import { EditorTabs } from './EditorTabs'
import { FileExplorer } from './FileExplorer'
import { StatusBar } from './StatusBar'
import { WindowControls, headerHeight } from './WindowControls'

const EditorComponent = dynamic(() => import('../EditorComponent'), { ssr: false })

const MonacoEditor: FC = () => {
  const { getCurrentTheme } = useMonacoThemeStore()
  const pixis = usePixisPreferencesStore(s => s.pixis)
  const activityActive = useWorkspaceStore(s => s.activityActive)
  const theme = getCurrentTheme()
  const chrome = { ...chromeDefaults, ...pixis.chrome }

  const foreground = theme?.colors['editor.foreground']
  const background = theme?.colors['editor.background']
  const controlsOnLeft = chrome.controlsSide === 'left'
  const showControls = chrome.controls !== 'none'
  const showExplorer = chrome.fileExplorer && (!chrome.activityBar || activityActive === 'files')

  const headerTintStyle: CSSProperties = { height: headerHeight(chrome.headerDensity) }
  if (chrome.headerTint === 'subtle')
    headerTintStyle.backgroundColor = `color-mix(in oklab, ${foreground ?? '#888'} 6%, transparent)`

  if (chrome.headerTint === 'solid')
    headerTintStyle.backgroundColor = `color-mix(in oklab, ${background ?? '#111'} 82%, ${foreground ?? '#888'} 8%)`

  return (
    <article
      id='monacoEditor'
      className='flex flex-col overflow-hidden'
      style={{
        backgroundColor: background,
        width: pixis.containerWidth,
        height: pixis.containerHeight,
        borderRadius: pixis.borderRadius,
        color: foreground
      }}
    >
      <header
        className={cn('relative flex shrink-0 items-center gap-3 px-3', chrome.headerAccent && 'border-b border-current/15')}
        style={headerTintStyle}
      >
        {showControls && (
          <div className={cn('z-10 flex shrink-0 items-center', !controlsOnLeft && 'order-2 ml-auto')}>
            <WindowControls chrome={chrome} />
          </div>
        )}

        <div className='flex min-w-0 flex-1 items-center'>
          <EditorTabs
            foreground={foreground}
            tabStyle={chrome.tabStyle}
            tabBadges={chrome.tabBadges}
            showTabAdd={chrome.showTabAdd}
          />
        </div>
      </header>

      <div className='flex min-h-0 flex-1'>
        {chrome.activityBar && <ActivityBar foreground={foreground} />}
        {showExplorer && <FileExplorer foreground={foreground} />}

        <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
          {chrome.breadcrumb && <EditorBreadcrumb foreground={foreground} />}
          <div className='min-h-0 flex-1'>
            <EditorComponent />
          </div>
        </div>
      </div>

      {chrome.statusBar && <StatusBar foreground={foreground} background={background} density={chrome.statusBarDensity} />}
    </article>
  )
}

export default memo(MonacoEditor)
