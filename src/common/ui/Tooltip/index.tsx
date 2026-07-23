'use client'

import * as React from 'react'

import { InfoIcon } from 'lucide-react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { twMerge } from 'tailwind-merge'

function TooltipProvider({
  delayDuration = 200,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function TooltipRoot({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot='tooltip' {...props} />
}

function TooltipTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger
      data-slot='tooltip-trigger'
      className={twMerge('[text-align:initial] size-fit', className)}
      {...props}
    />
  )
}

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  backgroundColor?: string
  borderColor?: string
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  backgroundColor = 'bg-card',
  borderColor = 'border-primary/30',
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        sideOffset={sideOffset}
        className={twMerge(
          'z-[2000] inline-flex w-max max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs leading-snug text-foreground whitespace-nowrap data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 has-data-[slot=kbd]:pr-1.5',
          className,
          backgroundColor,
          borderColor
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className={twMerge(
            'z-[2000] size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-sm border-r border-b fill-transparent',
            backgroundColor,
            borderColor
          )}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

interface InfoTooltipProps extends TooltipContentProps {
  children?: React.ReactNode | string
}

const InfoTooltip = ({ children, ...props }: InfoTooltipProps) => {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger className='cursor-help text-muted-foreground'>
        <InfoIcon className='size-4' />
      </TooltipPrimitive.Trigger>
      <TooltipContent {...props} className={twMerge('whitespace-normal', props.className)}>
        {typeof children === 'string' ? (
          <p className='max-w-xs text-xs leading-snug text-muted-foreground'>{children}</p>
        ) : (
          children
        )}
      </TooltipContent>
    </TooltipPrimitive.Root>
  )
}

const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Content: TooltipContent,
  Trigger: TooltipTrigger,
  Info: InfoTooltip
})

export default Tooltip
