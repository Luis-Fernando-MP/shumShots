'use client'

import Button from '@common/components/Button'
import { cn } from '@common/utils/cn'
import type { FC, ReactNode } from 'react'

interface DomainPanelProps {
  children?: ReactNode
  onReset?: () => void
  resetLabel?: string
  className?: string
}

/**
 * Contenedor de un panel de dominio en la sidebar del image-studio.
 *
 * @param props.children - Secciones y builders del dominio.
 * @param props.onReset - Si se pasa, muestra el pie de reset.
 * @param props.resetLabel - Texto del botón. Default «Resetear cambios».
 */
const DomainPanel: FC<DomainPanelProps> = ({
  children,
  onReset,
  resetLabel = 'Resetear cambios',
  className
}) => (
  <div className='flex h-full min-h-0 flex-col'>
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
    >
      {children}
    </div>
    {onReset && (
      <div className='border-border/50 shrink-0 border-t px-3 py-2.5'>
        <Button type='button' variant='outline' size='sm' className='w-full rounded-[12px] text-xs' onClick={onReset}>
          {resetLabel}
        </Button>
      </div>
    )}
  </div>
)

export default DomainPanel
