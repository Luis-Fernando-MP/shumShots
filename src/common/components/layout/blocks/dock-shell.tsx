'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { cn } from '@common/utils/cn'
import type { CSSProperties, ReactNode } from 'react'

interface DockShellProps {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  placement: 'top' | 'bottom'
}

/**
 * Cápsula flotante compartida por los docks del estudio.
 *
 * @param props.placement - Ancla superior o inferior, centrada en el viewport.
 * @param props.children - Controles del dock.
 * @returns La cápsula posicionada sobre el lienzo.
 */
const DockShell = ({ children, className, style, placement }: DockShellProps) => (
  <div
    className={cn(
      'border-border/50 bg-card/70 backdrop-blur-panel pointer-events-auto flex size-fit flex-row items-center justify-center gap-2 rounded-[16px] border px-3 py-2',
      '[&_button]:rounded-[12px]',
      placement === 'top' ? 'absolute top-5 left-1/2 -translate-x-1/2' : 'absolute bottom-5 left-1/2 -translate-x-1/2',
      className
    )}
    style={{ zIndex: APP_Z_INDEX.studio.dock, ...style }}
  >
    {children}
  </div>
)

export default DockShell
