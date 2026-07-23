import { BirdIcon, CheckIcon, HandIcon, XIcon } from 'lucide-react'
import { FC } from 'react'
import hotToast, { LoaderIcon, Toast } from 'react-hot-toast'

import type { IToastProps } from '..'
const Icons = {
  success: CheckIcon,
  error: XIcon,
  warning: HandIcon,
  info: BirdIcon,
  pending: LoaderIcon
}

interface Props extends IToastProps {
  toastProps: Toast
  onAction?: () => void
  actionLabel?: string
  secondActionLabel?: string
  onSecondAction?: () => void
}

/**
 * @description Custom toast component with action button
 * @param toastProps - Toast props
 * @param title - Title
 * @param description - Description (optional)
 * @param icon - Icon (optional)
 * @param type - Type (success, error, warning, info, pending) default: info
 * @param onAction - Action to be executed when the action button is clicked
 * @param actionLabel - Action label (optional)
 * @param secondActionLabel - Second action label (optional)
 * @param onSecondAction - Action to be executed when the second action button is clicked
 */

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
  const Icon = Icons[type]

  const handleToastDismiss = () => {
    hotToast.dismiss(toastProps.id)
  }

  const handleAction = () => {
    handleToastDismiss()
    onAction?.()
  }

  const handleSecondAction = () => {
    handleToastDismiss()
    onSecondAction?.()
  }

  return (
    <section className='flex min-w-[150px] flex-col justify-center gap-3 rounded-lg p-4 shadow-md'>
      <div className={`w-fit rounded-full p-[5px] text-white [&>svg]:size-3 [&>svg]:stroke-[2.5] ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-blue-500'}`}>{icon || <Icon />}</div>
      <h2 className='max-w-[150px]'>{title}</h2>
      {description && <p className='max-w-[150px]'>{description}</p>}
      <div className='flex flex-col items-start gap-2'>
        <button className='rounded-md bg-muted px-2 py-1' onClick={handleToastDismiss}>
          Cerrar
        </button>

        {actionLabel && (
          <button className='rounded-md bg-muted px-2 py-1' onClick={handleAction}>
            {actionLabel}
          </button>
        )}

        {secondActionLabel && (
          <button className='rounded-md border-[1.5px] border-dashed border-primary px-2 py-1' onClick={handleSecondAction}>
            {secondActionLabel}
          </button>
        )}
      </div>
    </section>
  )
}

export default ActionToast
