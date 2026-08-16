'use client'

import type { ReactNode } from 'react'

import { SidebarContent, SidebarFooter, SidebarHeader, SidebarShell } from '../sidebar-shell'

interface RightSidebarProps {
  children?: ReactNode
  className?: string
}

/**
 * Barra lateral derecha del estudio (~260px, pegada al borde).
 *
 * @param props.children - `header`, `content`, `footer` o el cuerpo del panel.
 */
const RightSidebar = ({ children, className }: RightSidebarProps) => (
  <SidebarShell edge='right' className={className}>
    {children}
  </SidebarShell>
)

RightSidebar.header = SidebarHeader
RightSidebar.content = SidebarContent
RightSidebar.footer = SidebarFooter
RightSidebar.displayName = 'App.rightSidebar'

export default RightSidebar
