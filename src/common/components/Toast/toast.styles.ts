import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  type LucideIcon
} from 'lucide-react'

export type ToastTone = 'success' | 'error' | 'warning' | 'info' | 'pending'

export const toastBadgeClass: Record<ToastTone, string> = {
  success: 'bg-semantic-success text-semantic-success-text',
  error: 'bg-semantic-error text-semantic-error-text',
  warning: 'bg-semantic-warning text-semantic-warning-text',
  info: 'bg-semantic-info text-semantic-info-text',
  pending: 'bg-primary text-semantic-primary'
}

export const toastIcons: Record<ToastTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  warning: CircleAlert,
  info: Info,
  pending: LoaderCircle
}
