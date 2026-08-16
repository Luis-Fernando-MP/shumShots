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

/**
 * Componente de lienzo interactivo (Board).
 * 
 * Proporciona una superficie con capacidades de zoom y paneo mediante
 * eventos de ratón y táctiles.
 * 
 * @param props - Propiedades del componente.
 * @param props.children - Render prop que recibe el offset actual, la escala y la función de zoom.
 * @param props.className - Clases adicionales para la superficie del board.
 * @param props.isCenter - Si el contenido debe centrarse inicialmente.
 * @param props.minScale - Si debe forzar la escala mínima.
 * @param props.normalScale - Si debe usar la escala normal inicial.
 * @returns El elemento JSX del board interactivo.
 */
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
      <div className={`board-surface ${className}`} ref={$childrenRef}>
        {children(offset, scale, handleScaleCentered)}
      </div>
    </article>
  )
}

export default Board
