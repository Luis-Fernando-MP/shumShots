'use client'

import { cn } from '@common/utils/cn'
import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode
}

/**
 * Agrupa campos dependientes. No envuelve un tab entero.
 *
 * @param props.children - Controles que solo tienen sentido juntos.
 */
const SectionGroup = ({ children, className, ...props }: Props) => (
  <div
    className={cn(
      'bg-muted/40 flex flex-col gap-3 rounded-[12px] p-3',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

export default SectionGroup
