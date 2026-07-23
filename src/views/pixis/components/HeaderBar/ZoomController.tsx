'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useBoardStore from '@/shared/components/Board/board.store'
import Button from '@/shared/ui/Button'
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
      <span className='text-xs text-muted-foreground'>Zoom:</span>
      <Button
        size='icon'
        tooltip='Aumentar zoom'
        tooltipPosition='bottom'
        onClick={handleZoomIn}
        onKeyDown={(e) => handleKeyDown(e, handleZoomIn)}
        className={isAnimating ? 'pointer-events-none scale-95 opacity-70 transition-all duration-150' : ''}
      >
        <PlusIcon />
      </Button>
      <Button
        size='icon'
        tooltip='Disminuir zoom'
        tooltipPosition='bottom'
        onClick={handleZoomOut}
        onKeyDown={(e) => handleKeyDown(e, handleZoomOut)}
        className={isAnimating ? 'pointer-events-none scale-95 opacity-70 transition-all duration-150' : ''}
      >
        <MinusIcon />
      </Button>
      <span className={`inline-block w-14 text-center text-xs tabular-nums transition-all duration-150 ${isAnimating ? 'pointer-events-none scale-95 opacity-70' : ''}`}>
        {Number(scale * 100).toFixed(0)}%
      </span>
    </>
  )
}

export default ZoomController
