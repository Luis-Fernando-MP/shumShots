'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { type FC, type ReactNode } from 'react'
import hotToast, { type Toast } from 'react-hot-toast'

import { type ToastTone, toastBadgeClass, toastIcons } from './toast.styles'

export type ToastProps = {
  title: string
  description?: string
  icon?: ReactNode
  type?: ToastTone
}

type Props = ToastProps & {
  toastProps: Toast
  onAction?: () => void
  actionLabel?: string
  secondActionLabel?: string
  onSecondAction?: () => void
}

const ActionToast: FC<Props> = ({
  toastProps,
  title,
  description,
  icon,
  type = 'info',
  onAction,
  actionLabel,
  secondActionLabel,
  onSecondAction
}) => {
  const Icon = toastIcons[type]
  const dismiss = () => hotToast.dismiss(toastProps.id)

  return (
    <section className='flex w-[min(100vw-2rem,16rem)] flex-col gap-3 p-3.5 text-left'>
      <div
        className={cn(
          'flex size-7 items-center justify-center rounded-full [&>svg]:size-3.5 [&>svg]:stroke-[2.25]',
          toastBadgeClass[type]
        )}
      >
        {icon || <Icon className={type === 'pending' ? 'animate-spin' : undefined} />}
      </div>

      <div className='flex flex-col gap-1'>
        <h2 className='text-sm font-medium text-foreground'>{title}</h2>
        {description && <p className='text-xs leading-snug text-muted-foreground'>{description}</p>}
      </div>

      <div className='flex flex-col gap-1.5'>
        {actionLabel && (
          <Button
            size='sm'
            variant='primary'
            className='w-full'
            onClick={() => {
              dismiss()
              onAction?.()
            }}
          >
            {actionLabel}
          </Button>
        )}

        {secondActionLabel && (
          <Button
            size='sm'
            variant='outline'
            className='w-full border-dashed border-primary'
            onClick={() => {
              dismiss()
              onSecondAction?.()
            }}
          >
            {secondActionLabel}
          </Button>
        )}

        <Button size='sm' variant='ghost' className='w-full' onClick={dismiss}>
          Cerrar
        </Button>
      </div>
    </section>
  )
}

export default ActionToast
