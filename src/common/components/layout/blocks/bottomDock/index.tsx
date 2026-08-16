'use client'

import type { CSSProperties, ReactNode } from 'react'

import DockShell from '../dock-shell'

interface BottomDockProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * Dock inferior flotante: captura y acciones primarias del estudio.
 *
 * @param props.children - Controles del chrome inferior.
 * @returns La cápsula anclada abajo al centro.
 */
const BottomDock = ({ children, className, style }: BottomDockProps) => (
  <DockShell placement='bottom' className={className} style={style}>
    {children}
  </DockShell>
)

BottomDock.displayName = 'App.bottomDock'

export default BottomDock
