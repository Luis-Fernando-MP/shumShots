import type { FC, ReactNode } from 'react'

import LabelText from '../LabelText'
interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  label?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const SimpleButtonLabel: FC<Props> = ({ children, label, position, className, ...props }) => {
  const parsedClassName = `group relative grid size-fit place-content-center ${className}`

  return (
    <button className={parsedClassName} {...props}>
      <div className='flex flex-row items-center gap-1 [&>svg]:size-5'>{children}</div>
      {label && (
        <LabelText type='darken' className={`pointer-events-none absolute z-20 left-1/2 min-w-fit -translate-x-1/2 select-none opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${position === 'top' ? '-top-6' : position === 'bottom' ? '-bottom-6' : position === 'left' ? '-left-6' : '-right-6'}`}>
          {label}
        </LabelText>
      )}
    </button>
  )
}

export default SimpleButtonLabel
