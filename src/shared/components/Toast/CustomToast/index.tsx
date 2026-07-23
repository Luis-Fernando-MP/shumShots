import { BirdIcon, CheckIcon, HandIcon, XIcon } from 'lucide-react'
import { FC } from 'react'
import hotToast, { LoaderIcon, Toast } from 'react-hot-toast'

import type { IToastProps } from '..'
interface Props extends IToastProps {
  toastProps: Toast
}

const Icons = {
  success: CheckIcon,
  error: XIcon,
  warning: HandIcon,
  info: BirdIcon,
  pending: LoaderIcon
}

/**
 * @description Custom basic toast component
 * @param toastProps - Hot toast props
 * @param title - Title (required)
 * @param description - Description (optional)
 * @param icon - Icon (optional)
 * @param type - Type default: info - (success, error, warning, info, pending)
 */

const CustomToast: FC<Props> = ({ toastProps, title, description, icon, type = 'info' }) => {
  const Icon = Icons[type]

  const handleClick = () => {
    if (type === 'pending') return
    hotToast.dismiss(toastProps.id)
  }

  return (
    <button className='flex min-w-[100px] flex-row items-center justify-center gap-2 p-2 shadow-md' onClick={handleClick}>
      <div className={`rounded-full p-[5px] text-white [&>svg]:size-3 [&>svg]:stroke-[2.5] ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-blue-500'}`}>{icon || <Icon />}</div>
      <div className='flex flex-col gap-1'>
        <h5 className='text-foreground'>{title}</h5>
        {description && <p className='max-w-[170px] text-sm'>{description}</p>}
      </div>
    </button>
  )
}

export default CustomToast
