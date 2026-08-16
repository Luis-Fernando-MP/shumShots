'use client'

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
}

const CustomToast: FC<Props> = ({ toastProps, title, description, icon, type = 'info' }) => {
  const Icon = toastIcons[type]

  return (
    <button
      type='button'
      className='flex min-w-[10rem] items-center gap-2.5 px-3 py-2.5 text-left'
      onClick={() => {
        if (type === 'pending') return
        hotToast.dismiss(toastProps.id)
      }}
    >
      <div
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full [&>svg]:size-3.5 [&>svg]:stroke-[2.25]',
          toastBadgeClass[type]
        )}
      >
        {icon || <Icon className={type === 'pending' ? 'animate-spin' : undefined} />}
      </div>
      <div className='flex min-w-0 flex-col gap-0.5'>
        <h5 className='text-sm font-medium text-foreground'>{title}</h5>
        {description && (
          <p className='max-w-[14rem] text-xs leading-snug text-muted-foreground'>{description}</p>
        )}
      </div>
    </button>
  )
}

export default CustomToast
