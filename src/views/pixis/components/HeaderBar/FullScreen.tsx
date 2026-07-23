'use client'

import { acl } from '@/shared/acl'
import IconButton from '@/shared/ui/IconButton'
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
    <IconButton
      transparent
      label={isFullScreen ? 'Minimizar la aplicación' : 'Maximizar la aplicación'}
      position='bottom'
      className={acl(isFullScreen)}
      onClick={handleScreen}
    >
      {isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
    </IconButton>
  )
}

export default FullScreen
