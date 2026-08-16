'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { cn } from '@common/utils/cn'
import type { ReactNode } from 'react'

interface RightSidebarProps {
  children?: ReactNode
  className?: string
}

/**
 * Barra lateral derecha del estudio (~260px, pegada al borde).
 *
 * @param props.children - Tabs y paneles de dominio.
 * @returns El aside a altura completa, alineado a la derecha.
 */
const RightSidebar = ({ children, className }: RightSidebarProps) => (
  <aside
    className={cn(
      'border-border/50 bg-card/80 backdrop-blur-panel relative flex h-dvh w-[260px] shrink-0 flex-col overflow-hidden rounded-l-[16px] border-y-0 border-r-0 border-l',
      className
    )}
    style={{ zIndex: APP_Z_INDEX.studio.sidebar }}
  >
    {children}
  </aside>
)

RightSidebar.displayName = 'App.rightSidebar'

export default RightSidebar
