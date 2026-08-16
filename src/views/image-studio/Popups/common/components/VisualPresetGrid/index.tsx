'use client'

import SliceContainer from '@common/components/SliceContainer'
import { chromeFrame } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

type GridProps = {
  children: ReactNode
  columns?: 3 | 4
  maxHeight?: number
  className?: string
}

/**
 * Grilla de presets visuales (3 o 4 columnas) con SliceContainer.
 *
 * @param props.columns - Columnas. Default 3.
 */
const VisualPresetGrid: FC<GridProps> = ({ children, columns = 3, maxHeight = 140, className }) => (
  <SliceContainer
    maxHeight={maxHeight}
    extendedMaxHeight={420}
    collapsedVisible={columns === 4 ? 8 : 6}
    className={cn(columns === 4 ? 'grid grid-cols-4 gap-2' : 'grid grid-cols-3 gap-2', className)}
  >
    {children}
  </SliceContainer>
)

type TileProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  children: ReactNode
}

/**
 * Tile h-12 con marco chrome. El hijo pinta el preview.
 *
 * @param props.active - Si el preset está seleccionado.
 */
const VisualPresetTile: FC<TileProps> = ({ active = false, children, className, ...props }) => (
  <button type='button' aria-pressed={active} className={cn('min-w-0', className)} {...props}>
    <div className={cn('relative h-12 w-full overflow-hidden', chromeFrame(active))}>{children}</div>
  </button>
)

export { VisualPresetGrid, VisualPresetTile }
export default VisualPresetGrid
