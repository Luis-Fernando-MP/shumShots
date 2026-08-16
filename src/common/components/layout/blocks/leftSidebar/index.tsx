'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { cn } from '@common/utils/cn'
import type { ReactNode } from 'react'

interface LeftSidebarProps {
  children?: ReactNode
  className?: string
}

/**
 * Barra lateral izquierda del estudio (~260px, pegada al borde).
 *
 * @param props.children - Tabs y paneles de dominio.
 * @returns El aside a altura completa, alineado a la izquierda.
 */
const LeftSidebar = ({ children, className }: LeftSidebarProps) => (
  <aside
    className={cn(
      'border-border/50 bg-card/80 backdrop-blur-panel relative flex h-dvh w-[260px] shrink-0 flex-col overflow-hidden rounded-r-[16px] border-y-0 border-l-0 border-r',
      className
    )}
    style={{ zIndex: APP_Z_INDEX.studio.sidebar }}
  >
    {children}
  </aside>
)

LeftSidebar.displayName = 'App.leftSidebar'

export default LeftSidebar
