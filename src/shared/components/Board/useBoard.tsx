import { useCallback, useEffect, useRef, useState } from 'react'

import useBoardStore, { MAX_SCALE, MIN_SCALE, Positions } from './board.store'

interface IUseBoardHook {
  isCenter: boolean
  minScale?: boolean
  normalScale?: boolean
}

export interface BoardRef {
  nextChild: () => void
  prevChild: () => void
  moveToChild: (index: number) => void
  handleScale: (scale: number) => void
}

const useBoard = ({ isCenter, minScale = false, normalScale = false }: IUseBoardHook) => {
  const { offset, scale, setOffset, setScale, setScaleCentered, setPrevChild, setNextChild, setMoveToChild, enableScroll } = useBoardStore()
  const $containerRef = useRef<HTMLDivElement>(null)
  const $childrenRef = useRef<HTMLDivElement>(null)

  const [isMoving, setIsMoving] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<Positions | null>(null)
  const [childIndex, setChildIndex] = useState(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  const handleScale = (scale: number): void => {
    setScale(scale)
  }

  const handleScaleCentered = (direction: 'in' | 'out'): void => {
    if (!$containerRef.current) {
      setScaleCentered(direction)
      return
    }
    const rect = $containerRef.current.getBoundingClientRect()
    setScaleCentered(direction, rect, offset, scale)
  }

  const getDynamicScale = (parent: DOMRect, children: DOMRect) => {
    const paAspect = parent.width / parent.height
    const chiAspect = children.width / children.height
    let scale: number
    if (paAspect > chiAspect) scale = parent.height / children.height
    else scale = parent.width / children.width
    const maxScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))
    const minScale = Math.min(MIN_SCALE, Math.min(MAX_SCALE, scale))
    return { scale, maxScale, minScale }
  }

  const centerChildren = useCallback(
    (scale: number) => {
      if (!$containerRef.current || !$childrenRef.current) return { newOffsetX: 0, newOffsetY: 0 }
      const paRect = $containerRef.current.getBoundingClientRect()
      const chiRect = $childrenRef.current.getBoundingClientRect()
      const newOffsetX = (paRect.width - chiRect.width * scale) / 2
      const newOffsetY = (paRect.height - chiRect.height * scale) / 2
      setOffset({ x: newOffsetX, y: newOffsetY })
      return { newOffsetX, newOffsetY }
    },
    [setOffset]
  )

  const centerAndFit = useCallback(() => {
    if (!$containerRef.current || !$childrenRef.current) return
    const paRect = $containerRef.current.getBoundingClientRect()
    const chiRect = $childrenRef.current.getBoundingClientRect()
    const { scale } = getDynamicScale(paRect, chiRect)
    const { newOffsetX, newOffsetY } = centerChildren(scale)
    setScale(scale)
    setOffset({ x: newOffsetX, y: newOffsetY })
  }, [centerChildren, setScale, setOffset])

  const moveToChild = useCallback(
    (index: number, extraScale: number = 1) => {
      if (!$childrenRef.current || !$containerRef.current) return
      const children = Array.from($childrenRef.current.children) as HTMLElement[]
      if (index < 0 || index >= children.length) return

      const paRect = $containerRef.current.getBoundingClientRect()
      const chiRect = children[index].getBoundingClientRect()
      const childrenRect = $childrenRef.current.getBoundingClientRect()

      const distance = chiRect.left - childrenRect.left
      const centerXSpace = paRect.width / 2 - (chiRect.width * extraScale) / 2
      const newOffsetY = (paRect.height - childrenRect.height * extraScale) / 2

      setOffset({ x: -distance + centerXSpace, y: newOffsetY })
      setChildIndex(index)

      if (extraScale === 1) {
        $childrenRef.current.classList.add('animate')
        setTimeout(() => {
          $childrenRef.current?.classList.remove('animate')
        }, 300)
      }
    },
    [setOffset]
  )

  const centerWithSpacing = useCallback(() => {
    if (!$containerRef.current || !$childrenRef.current) return
    const paRect = $containerRef.current.getBoundingClientRect()
    const childrenRect = $childrenRef.current.getBoundingClientRect()
    const { minScale: appMinScale, maxScale } = getDynamicScale(paRect, childrenRect)
    setScale(minScale ? appMinScale : maxScale)
    moveToChild(0, minScale ? appMinScale : maxScale)
  }, [moveToChild, setScale, minScale])

  const handleBoardDown = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      setIsMoving(true)
      setLastMousePosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleBoardMove = useCallback((e: React.MouseEvent) => {
    if (!isMoving || !lastMousePosition) return

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const deltaX = e.clientX - lastMousePosition.x
      const deltaY = e.clientY - lastMousePosition.y
      const newX = offset.x + deltaX
      const newY = offset.y + deltaY
      setOffset({ x: newX, y: newY })
      setLastMousePosition({ x: e.clientX, y: e.clientY })
    })
  }, [isMoving, lastMousePosition, offset, setOffset])

  const handleBoardUp = useCallback(() => {
    setIsMoving(false)
    setLastMousePosition(null)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()

      const zoomFactor = 1.1
      const canvas = $containerRef.current
      if (!canvas) return

      const newScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale))

      if (Math.abs(clampedScale - scale) < 0.001) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left - offset.x) / scale
      const mouseY = (e.clientY - rect.top - offset.y) / scale

      setScale(clampedScale)
      const newOffsetX = offset.x - mouseX * (clampedScale - scale)
      const newOffsetY = offset.y - mouseY * (clampedScale - scale)
      setOffset({ x: newOffsetX, y: newOffsetY })
    },
    [offset, scale, setOffset, setScale]
  )

  const nextChild = useCallback(() => {
    moveToChild(childIndex + 1)
  }, [childIndex, moveToChild])

  const prevChild = useCallback(() => {
    moveToChild(childIndex - 1)
  }, [childIndex, moveToChild])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleBoardDown({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleBoardMove({ clientX: touch.clientX, clientY: touch.clientY } as React.MouseEvent)
  }

  const handleTouchEnd = () => {
    handleBoardUp()
  }

  useEffect(() => {
    const canvas = $containerRef.current
    if (canvas && !enableScroll) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      canvas?.removeEventListener('wheel', handleWheel)
    }
  }, [scale, offset, enableScroll, handleWheel])

  useEffect(() => {
    // Always start at 100% scale
    setScale(1)

    if (normalScale) {
      const { newOffsetX, newOffsetY } = centerChildren(1)
      setOffset({ x: newOffsetX, y: newOffsetY })
    } else if (isCenter) {
      centerAndFit()
    } else {
      centerWithSpacing()
    }
  }, []) // Run only once on mount

  useEffect(() => {
    setPrevChild(prevChild)
    setNextChild(nextChild)
    setMoveToChild(moveToChild)
  }, [setPrevChild, setNextChild, setMoveToChild, prevChild, nextChild, moveToChild])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    $containerRef,
    $childrenRef,
    isMoving,
    offset,
    scale,
    handleScale,
    handleScaleCentered,
    handleBoardDown,
    handleBoardMove,
    handleBoardUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}

export default useBoard
