import Hydration from '@common/components/Hydration'
import DetailBar from '@views/pixis/components/DetailBar'
import HeaderBar from '@views/pixis/components/HeaderBar'
import type { JSX, ReactNode } from 'react'

interface PixisLayoutProps {
  children: ReactNode
}

const PixisLayout = ({ children }: PixisLayoutProps): JSX.Element => {
  return (
    <Hydration>
      <HeaderBar className='absolute top-5 left-1/2 z-10 -translate-x-1/2' />
      <DetailBar className='absolute top-5 left-5 z-10' />

      <div className='from-secondary to-primary pointer-events-none absolute -bottom-[30%] left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-linear-to-r blur-[250px]' />

      {children}
    </Hydration>
  )
}

export default PixisLayout
