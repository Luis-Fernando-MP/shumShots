import Hydration from '@common/components/Hydration'
import type { JSX, ReactNode } from 'react'

interface PixisLayoutProps {
  children: ReactNode
}

const PixisLayout = ({ children }: PixisLayoutProps): JSX.Element => {
  return (
    <Hydration>
      <div className='from-secondary to-primary pointer-events-none absolute -bottom-[50%] left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-linear-to-r blur-[200px]' />

      {children}
    </Hydration>
  )
}

export default PixisLayout
