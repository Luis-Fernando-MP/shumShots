'use client'

import Tooltip from '@common/ui/Tooltip'
import { cn } from '@common/utils/cn'
import type { FC, ReactNode } from 'react'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  outline?: boolean
  className?: string
  active?: boolean
}

const Button: FC<Props> = ({
  children,
  tooltip,
  tooltipPosition = 'top',
  outline = false,
  className = '',
  active = false,
  ...props
}) => {
  const button = (
    <button
      className={cn(
        'bg-card relative grid size-fit min-w-9 place-content-center rounded-md p-2 text-sm',
        outline && 'border-primary border-2 border-dashed',
        active && 'bg-primary',
        className
      )}
      {...props}
    >
      <div className='flex flex-row items-center gap-1 text-sm [&>svg]:size-5'>{children}</div>
    </button>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content side={tooltipPosition} backgroundColor='bg-background' borderColor='border-border'>
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  )
}

export default Button
