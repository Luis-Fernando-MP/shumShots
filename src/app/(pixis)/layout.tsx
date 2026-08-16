import Hydration from '@common/components/Hydration'
import type { JSX, ReactNode } from 'react'

interface PixisLayoutProps {
  children: ReactNode
}

const PixisLayout = ({ children }: PixisLayoutProps): JSX.Element => {
  return (
    <Hydration>
      <div className='from-secondary to-primary pointer-events-none absolute -bottom-[30%] left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-linear-to-r blur-[250px]' />

      {children}
    </Hydration>
  )
}

export default PixisLayout
