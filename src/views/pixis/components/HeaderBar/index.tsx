import ThemeController from '@/shared/components/ThemeController'
import { type FC } from 'react'

import FullScreen from './FullScreen'
import ZoomController from './ZoomController'

interface Props {
  className?: string
}

const HeaderBar: FC<Props> = ({ className }) => {
  return (
    <section
      className={`gap-grid rounded-radius bg-card/50 p-grid-sm backdrop-blur-panel flex size-fit flex-row items-center justify-center ${className}`}
    >
      <ThemeController />

      <FullScreen />
      <div className='bg-border h-6 w-px' />
      <ZoomController />
    </section>
  )
}

export default HeaderBar
