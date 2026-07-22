'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useBoardStore from '@/shared/components/Board/board.store'
import IconButton from '@/shared/ui/IconButton'
import { MinusIcon, PlusIcon } from 'lucide-react'
import type { FC } from 'react'

const ZoomController: FC = () => {
  const { scale, setScaleCentered } = useBoardStore()
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleZoomIn = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    setScaleCentered('in')

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 150)
  }, [isAnimating, setScaleCentered])

  const handleZoomOut = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    setScaleCentered('out')

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 150)
  }, [isAnimating, setScaleCentered])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <h5>Zoom :</h5>
      <IconButton
        transparent
        label='Aumentar zoom'
        position='bottom'
        onClick={handleZoomIn}
        onKeyDown={(e) => handleKeyDown(e, handleZoomIn)}
        className={isAnimating ? 'zoom-animating' : ''}
      >
        <PlusIcon />
      </IconButton>
      <IconButton
        transparent
        label='Disminuir zoom'
        position='bottom'
        onClick={handleZoomOut}
        onKeyDown={(e) => handleKeyDown(e, handleZoomOut)}
        className={isAnimating ? 'zoom-animating' : ''}
      >
        <MinusIcon />
      </IconButton>
      <h5 className={`headerBar-percentage ${isAnimating ? 'zoom-animating' : ''}`}>
        {Number(scale * 100).toFixed(0)}%
      </h5>
    </>
  )
}

export default ZoomController
