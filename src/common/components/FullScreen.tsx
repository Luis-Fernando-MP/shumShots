'use client'

import { Maximize, Minimize } from 'lucide-react'
import { type HtmlHTMLAttributes, type JSX, type ReactNode, useState } from 'react'

interface IFullScreen extends HtmlHTMLAttributes<HTMLElement> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
}

const FullScreen = ({ children, ...props }: IFullScreen): JSX.Element => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleScreen = () => {
    setIsFullScreen(!isFullScreen)
    if (!document.fullscreenElement) {
      return document.documentElement.requestFullscreen()
    }
    document.exitFullscreen()
  }

  return (
    <button {...props} onClick={handleScreen}>
      {isFullScreen ? <Minimize /> : <Maximize />}
      {children}
    </button>
  )
}

export default FullScreen
