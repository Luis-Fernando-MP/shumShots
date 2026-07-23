import type { FC, InputHTMLAttributes, ReactNode } from 'react'
import { Input } from 'react-field-sizing-content'

import LabelText from '../LabelText'
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string | number
  Icon?: ReactNode
  label?: string
  fieldSizing?: 'content' | 'fixed'
  width?: string
}

/**
 * IconInput component that combines an icon and an input field.
 *
 * @description This component allows displaying an icon next to a text input field.
 * It can be customized with various properties such as field size, initial value,
 * and the label shown next to the field. Ideal for forms where a text input
 * is required alongside a representative icon.
 *
 * @param {ReactNode} Icon - The icon to be displayed next to the input field.
 * @param {string} label - The label to be displayed below the input field.
 * @param {string | number} value - The initial value of the input field.
 * @param {'content' | 'fixed'} [fieldSizing='content'] - Defines whether the field size adjusts to content or is fixed.
 * @param {string} [width='100'] - Width of the input field.
 * @param {function} onChange - Function that is executed when the value of the input field changes.
 * @param {InputHTMLAttributes<HTMLInputElement>} props - Other properties of the input element.
 */

const IconInput: FC<Props> = ({
  Icon,
  label,
  value,
  className = '',
  onChange,
  fieldSizing = 'content',
  width = 100,
  style,
  ...props
}) => {
  return (
    <div className='flex w-fit max-w-full flex-row flex-wrap items-center gap-2 rounded-md bg-background p-2'>
      {Icon && <div>{Icon}</div>}
      <Input
        className={`min-w-[50px] bg-transparent outline-none ${className}`}
        {...props}
        fieldSizing={fieldSizing}
        value={value}
        onChange={onChange}
        style={{ width, ...style }}
      />
      {label && <LabelText>{label}</LabelText>}
    </div>
  )
}

export default IconInput
