'use client'

import { cn } from '@common/utils/cn'
import type { ReactNode } from 'react'

interface CanvasProps {
  children?: ReactNode
  className?: string
}

/**
 * Área hero del estudio. El Board debe llenar este slot.
 *
 * @param props.children - Superficie del lienzo (normalmente `Board`).
 * @returns El contenedor flexible que ocupa el espacio restante.
 */
const Canvas = ({ children, className }: CanvasProps) => (
  <div className={cn('relative min-h-0 min-w-0 flex-1', className)}>{children}</div>
)

Canvas.displayName = 'App.canvas'

export default Canvas
