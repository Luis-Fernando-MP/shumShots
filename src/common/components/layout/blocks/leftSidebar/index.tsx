'use client'

import type { ReactNode } from 'react'

import { SidebarContent, SidebarFooter, SidebarHeader, SidebarShell } from '../sidebar-shell'

interface LeftSidebarProps {
  children?: ReactNode
  className?: string
}

/**
 * Barra lateral izquierda del estudio (~260px, pegada al borde).
 *
 * @param props.children - `header`, `content`, `footer` o el cuerpo del panel.
 */
const LeftSidebar = ({ children, className }: LeftSidebarProps) => (
  <SidebarShell edge='left' className={className}>
    {children}
  </SidebarShell>
)

LeftSidebar.header = SidebarHeader
LeftSidebar.content = SidebarContent
LeftSidebar.footer = SidebarFooter
LeftSidebar.displayName = 'App.leftSidebar'

export default LeftSidebar
