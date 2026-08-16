'use client'

import { cn } from '@common/utils/cn'
import { Children, type ReactNode, isValidElement } from 'react'

import BottomDock from './blocks/bottomDock'
import Canvas from './blocks/canvas'
import LeftSidebar from './blocks/leftSidebar'
import RightSidebar from './blocks/rightSidebar'
import { AppTab, AppTabs } from './blocks/tabs'
import TopDock from './blocks/topDock'

interface AppProps {
  children?: ReactNode
  className?: string
}

const isPart = (child: ReactNode, type: unknown) => isValidElement(child) && child.type === type

/**
 * Shell de estudio: sidebars, lienzo hero y docks flotantes.
 *
 * Compone hijos tipados (`App.leftSidebar`, `App.canvas`, `App.rightSidebar`,
 * `App.topDock`, `App.bottomDock`). El Board debe vivir en `App.canvas`.
 *
 * @param props.children - Slots del chrome. El orden de declaración no importa.
 * @returns El marco a pantalla completa del estudio.
 * @example
 * ```tsx
 * <App>
 *   <App.leftSidebar>
 *     <App.tabs defaultValue="fondo">
 *       <App.tab value="fondo" label="Fondo">…</App.tab>
 *     </App.tabs>
 *   </App.leftSidebar>
 *   <App.canvas><Board>{() => <Shot />}</Board></App.canvas>
 *   <App.rightSidebar>…</App.rightSidebar>
 *   <App.topDock>…</App.topDock>
 *   <App.bottomDock>…</App.bottomDock>
 * </App>
 * ```
 */
const App = ({ children, className }: AppProps) => {
  let left: ReactNode
  let right: ReactNode
  let canvas: ReactNode
  let top: ReactNode
  let bottom: ReactNode

  Children.forEach(children, child => {
    if (isPart(child, LeftSidebar)) {
      left = child
      return
    }
    if (isPart(child, RightSidebar)) {
      right = child
      return
    }
    if (isPart(child, Canvas)) {
      canvas = child
      return
    }
    if (isPart(child, TopDock)) {
      top = child
      return
    }
    if (isPart(child, BottomDock)) {
      bottom = child
    }
  })

  return (
    <div className={cn('relative flex h-dvh w-full overflow-hidden', className)}>
      {left}
      {canvas}
      {right}
      {top}
      {bottom}
    </div>
  )
}

App.leftSidebar = LeftSidebar
App.rightSidebar = RightSidebar
App.canvas = Canvas
App.topDock = TopDock
App.bottomDock = BottomDock
App.tabs = AppTabs
App.tab = AppTab

export default App
