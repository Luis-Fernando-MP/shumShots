'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { cn } from '@common/utils/cn'
import type { ReactNode } from 'react'

interface SidebarShellProps {
  children?: ReactNode
  className?: string
  edge: 'left' | 'right'
}

/**
 * Cáscara compartida de las sidebars de estudio.
 *
 * @param props.edge - Lado del viewport; redondea solo hacia el lienzo.
 */
const SidebarShell = ({ children, className, edge }: SidebarShellProps) => (
  <aside
    className={cn(
      'border-border/50 bg-card/80 backdrop-blur-panel relative flex h-dvh w-[260px] shrink-0 flex-col overflow-hidden',
      edge === 'left' && 'rounded-r-[16px] border-y-0 border-l-0 border-r',
      edge === 'right' && 'rounded-l-[16px] border-y-0 border-r-0 border-l',
      className
    )}
    style={{ zIndex: APP_Z_INDEX.studio.sidebar }}
  >
    {children}
  </aside>
)

interface SidebarSlotProps {
  children?: ReactNode
  className?: string
}

const SidebarHeader = ({ children, className }: SidebarSlotProps) => (
  <header className={cn('border-border/50 shrink-0 border-b px-2 py-2', className)}>{children}</header>
)

const SidebarContent = ({ children, className }: SidebarSlotProps) => (
  <div className={cn('min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}>
    {children}
  </div>
)

const SidebarFooter = ({ children, className }: SidebarSlotProps) => (
  <footer className={cn('border-border/50 shrink-0 border-t px-3 py-2.5', className)}>{children}</footer>
)

SidebarHeader.displayName = 'App.sidebar.header'
SidebarContent.displayName = 'App.sidebar.content'
SidebarFooter.displayName = 'App.sidebar.footer'

export { SidebarContent, SidebarFooter, SidebarHeader, SidebarShell }
