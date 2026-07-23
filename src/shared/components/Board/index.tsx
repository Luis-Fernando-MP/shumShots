'use client'

import { type JSX, useEffect, useState } from 'react'

import './style.css'
import useBoard from './useBoard'

type TPositions = { x: number; y: number }

interface BoardProps {
  children: (offset: TPositions, scale: number, handleScaleCentered: (direction: 'in' | 'out') => void) => JSX.Element
  className?: string
  isCenter?: boolean
  minScale?: boolean
  normalScale?: boolean
}

const Board = ({ children, className = '', isCenter = true, minScale, normalScale }: BoardProps): JSX.Element => {
  const [ready, setReady] = useState(false)
  const {
    $containerRef,
    $childrenRef,
    isMoving,
    offset,
    scale,
    handleScaleCentered,
    handleBoardDown,
    handleBoardMove,
    handleBoardUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useBoard({ isCenter, minScale, normalScale })

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <article
      role='button'
      tabIndex={0}
      className={`board${ready ? ' is-ready' : ''}${isMoving ? ' is-grabbing' : ''}`}
      ref={$containerRef}
      onMouseDown={handleBoardDown}
      onMouseMove={handleBoardMove}
      onMouseUp={handleBoardUp}
      onMouseLeave={handleBoardUp}
      onContextMenu={e => e.preventDefault()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`board-surface ${className}`}
        ref={$childrenRef}
        style={{
          top: offset.y,
          left: offset.x,
          transform: `scale(${scale})`
        }}
      >
        {children(offset, scale, handleScaleCentered)}
      </div>
    </article>
  )
}

export default Board
