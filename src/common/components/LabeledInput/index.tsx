import { acl } from '@common/lib/acl'
import { type FC, type InputHTMLAttributes, type JSX } from 'react'

import LabelText from '../LabelText'
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string | number
  children?: string
  Icon?: JSX.Element
  transparent?: boolean
  className?: string
}

/**
 * @param {string | number} value - The value of the labeled input.
 * @param {string} children - The children of the labeled input.
 * @param {JSX.Element} Icon - The icon of the labeled input is optional.
 * @param {boolean} transparent - Whether the labeled input is transparent.
 */

const LabeledInput: FC<Props> = ({ children, Icon, transparent, className, ...props }) => {
  return (
    <div className={`relative flex size-fit flex-col items-start rounded-md border-[1.5px] border-transparent bg-card p-2 ${acl(!!transparent, 'border-transparent bg-transparent')} ${className}`}>
      <input {...props} className='min-w-[100px] bg-transparent pl-2 text-foreground outline-none' autoComplete='off' />
      <div className='absolute right-2 top-1/2 -translate-y-1/2'>{children && <LabelText Icon={Icon}>{children}</LabelText>}</div>
    </div>
  )
}

export default LabeledInput
