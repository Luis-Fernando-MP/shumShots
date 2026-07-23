'use client'

import Tooltip from '@common/ui/Tooltip'
import { cn } from '@common/utils/cn'
import type { FC, ReactNode } from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  label?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  outline?: boolean
  className?: string
  transparent?: boolean
  active?: boolean
}

const IconButton: FC<Props> = ({
  children,
  label,
  position = 'top',
  outline = false,
  className = '',
  transparent = false,
  active = false,
  ...props
}) => {
  const button = (
    <button
      className={cn(
        'bg-card relative grid size-fit min-w-9 place-content-center rounded-md p-2 text-sm',
        outline && 'border-primary border-2 border-dashed',
        transparent && 'bg-transparent',
        active && 'bg-primary',
        className
      )}
      {...props}
    >
      <div className='flex flex-row items-center gap-1 text-sm [&>svg]:size-5'>{children}</div>
    </button>
  )

  if (!label) return button

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content side={position} backgroundColor='bg-background' borderColor='border-border'>
        {label}
      </Tooltip.Content>
    </Tooltip>
  )
}

export default IconButton
