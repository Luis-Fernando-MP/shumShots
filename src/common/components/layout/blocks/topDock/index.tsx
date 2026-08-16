'use client'

import type { CSSProperties, ReactNode } from 'react'

import DockShell from '../dock-shell'

interface TopDockProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Dock superior flotante: tema, zoom, sistema y navegación entre estudios.
 *
 * @param props.children - Controles del chrome superior.
 * @returns La cápsula anclada arriba al centro.
 */
const TopDock = ({ children, className, style }: TopDockProps) => (
  <DockShell placement='top' className={className} style={style}>
    {children}
  </DockShell>
)

TopDock.displayName = 'App.topDock'

export default TopDock
