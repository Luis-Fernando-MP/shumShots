'use client'

import { acl } from '@/shared/acl'
import Button from '@/shared/ui/Button'
import { MaximizeIcon, MinimizeIcon } from 'lucide-react'
import { type FC, useState } from 'react'

const FullScreen: FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleScreen = () => {
    setIsFullScreen(!isFullScreen)
    if (!document.fullscreenElement) {
      return document.documentElement.requestFullscreen()
    }
    document.exitFullscreen()
  }

  return (
    <Button
      size='icon'
      tooltip={isFullScreen ? 'Minimizar la aplicación' : 'Maximizar la aplicación'}
      tooltipPosition='bottom'
      className={acl(isFullScreen)}
      onClick={handleScreen}
    >
      {isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </Button>
  )
}

export default FullScreen
