'use client'

import { type ComponentProps, type ReactNode } from 'react'
import hotToast, { Toaster as HotToaster, type Toast } from 'react-hot-toast'

import ActionToast from './ActionToast'
import CustomToast from './CustomToast'
import './toast.css'

export type { ToastTone } from './toast.styles'

export type ToastProps = {
  title: string
  description?: string
  icon?: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info' | 'pending'
}

type HotToastOptions = Omit<
  Toast,
  'type' | 'message' | 'icon' | 'style' | 'className' | 'iconTheme' | 'height'
>

type QuestionProps = Partial<HotToastOptions> &
  ToastProps & {
    onAction: () => void
    actionLabel?: string
    secondActionLabel?: string
    onSecondAction?: () => void
  }

const toastAction = (props: QuestionProps) => {
  const {
    title,
    description,
    icon,
    type,
    duration,
    onAction,
    actionLabel,
    secondActionLabel,
    onSecondAction,
    ...rest
  } = props

  return hotToast(
    t => (
      <ActionToast
        toastProps={t}
        title={title}
        description={description}
        icon={icon}
        type={type}
        onAction={onAction}
        actionLabel={actionLabel}
        secondActionLabel={secondActionLabel}
        onSecondAction={onSecondAction}
      />
    ),
    {
      ...rest,
      duration: type === 'pending' ? Number.POSITIVE_INFINITY : duration
    }
  )
}

/** Show a PIXIS toast notification. */
export const toaster = (props: Partial<HotToastOptions> & ToastProps) => {
  const { title, description, icon, type, duration, ...rest } = props
  return hotToast(
    t => <CustomToast toastProps={t} title={title} description={description} icon={icon} type={type} />,
    {
      ...rest,
      duration: type === 'pending' ? Number.POSITIVE_INFINITY : duration
    }
  )
}

toaster.question = toastAction

type ToasterProps = ComponentProps<typeof HotToaster>

/** App-level toast host. Mount once in the root layout. */
export const Toaster = ({
  position = 'bottom-right',
  toastOptions,
  ...props
}: ToasterProps) => (
  <HotToaster
    position={position}
    toastOptions={{ className: 'toast', ...toastOptions }}
    {...props}
  />
)

export default toaster
