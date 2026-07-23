import { useCallback, useEffect, useRef, useState } from 'react'

import useBoardStore, { MAX_SCALE, MIN_SCALE, Positions, SCALE_EPSILON, ZoomDirection } from './board.store'

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
  const {
    offset,
    scale,
    setOffset,
    setScale,
    setScaleCentered,
    setScaleAndOffset,
    setPrevChild,
    setNextChild,
    setMoveToChild,
    setResetZoom,
    setZoomCentered,
    enableScroll
  } = useBoardStore()
  const $containerRef = useRef<HTMLDivElement>(null)
  const $childrenRef = useRef<HTMLDivElement>(null)

  const [isMoving, setIsMoving] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState<Positions | null>(null)
  const [childIndex, setChildIndex] = useState(0)
  const animationFrameRef = useRef<number | undefined>(undefined)

  const handleScale = (nextScale: number): void => {
    setScale(nextScale)
  }

  const handleScaleCentered = useCallback(
    (direction: ZoomDirection): void => {
      const container = $containerRef.current
      if (!container) return
      setScaleCentered(direction, container.getBoundingClientRect())
    },
    [setScaleCentered]
  )

  const getLayoutSize = () => {
    if (!$childrenRef.current) return { width: 0, height: 0 }
    return {
      width: $childrenRef.current.offsetWidth,
      height: $childrenRef.current.offsetHeight
    }
  }

  const getDynamicScale = (parent: DOMRect, width: number, height: number) => {
    if (width <= 0 || height <= 0) {
      return { scale: 1, maxScale: MAX_SCALE, minScale: MIN_SCALE }
    }
    const paAspect = parent.width / parent.height
    const chiAspect = width / height
    const fitted = paAspect > chiAspect ? parent.height / height : parent.width / width
    const maxScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, fitted))
    const fittedMin = Math.min(MIN_SCALE, Math.min(MAX_SCALE, fitted))
    return { scale: fitted, maxScale, minScale: fittedMin }
  }

  const centerChildren = useCallback(
    (targetScale: number) => {
      if (!$containerRef.current || !$childrenRef.current) return { newOffsetX: 0, newOffsetY: 0 }
      const paRect = $containerRef.current.getBoundingClientRect()
      const { width, height } = getLayoutSize()
      const newOffsetX = (paRect.width - width * targetScale) / 2
      const newOffsetY = (paRect.height - height * targetScale) / 2
      setOffset({ x: newOffsetX, y: newOffsetY })
      return { newOffsetX, newOffsetY }
    },
    [setOffset]
  )

  const resetZoom = useCallback(() => {
    setScale(1)
    centerChildren(1)
  }, [centerChildren, setScale])

  const centerAndFit = useCallback(() => {
    if (!$containerRef.current || !$childrenRef.current) return
    const paRect = $containerRef.current.getBoundingClientRect()
    const { width, height } = getLayoutSize()
    const { scale: fitted } = getDynamicScale(paRect, width, height)
    const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, fitted))
    setScale(nextScale)
    centerChildren(nextScale)
  }, [centerChildren, setScale])

  const moveToChild = useCallback(
    (index: number, extraScale: number = 1) => {
      if (!$childrenRef.current || !$containerRef.current) return
      const children = Array.from($childrenRef.current.children) as HTMLElement[]
      if (index < 0 || index >= children.length) return

      const paRect = $containerRef.current.getBoundingClientRect()
      const child = children[index]
      const surfaceHeight = $childrenRef.current.offsetHeight
      const distance = child.offsetLeft
      const centerXSpace = paRect.width / 2 - (child.offsetWidth * extraScale) / 2
      const newOffsetY = (paRect.height - surfaceHeight * extraScale) / 2

      setOffset({ x: -distance * extraScale + centerXSpace, y: newOffsetY })
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
    const { width, height } = getLayoutSize()
    const { minScale: appMinScale, maxScale } = getDynamicScale(paRect, width, height)
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

  const handleBoardMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMoving || !lastMousePosition) return

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const deltaX = e.clientX - lastMousePosition.x
        const deltaY = e.clientY - lastMousePosition.y
        setOffset({ x: offset.x + deltaX, y: offset.y + deltaY })
        setLastMousePosition({ x: e.clientX, y: e.clientY })
      })
    },
    [isMoving, lastMousePosition, offset, setOffset]
  )

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

      const canvas = $containerRef.current
      if (!canvas) return

      const zoomingIn = e.deltaY < 0
      if (zoomingIn && scale >= MAX_SCALE - SCALE_EPSILON) return
      if (!zoomingIn && scale <= MIN_SCALE + SCALE_EPSILON) return

      const zoomFactor = 1.1
      const nextScale = zoomingIn ? scale * zoomFactor : scale / zoomFactor
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale))
      if (Math.abs(clampedScale - scale) < SCALE_EPSILON) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left - offset.x) / scale
      const mouseY = (e.clientY - rect.top - offset.y) / scale

      setScaleAndOffset(clampedScale, {
        x: offset.x - mouseX * (clampedScale - scale),
        y: offset.y - mouseY * (clampedScale - scale)
      })
    },
    [offset, scale, setScaleAndOffset]
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
    setScale(1)

    if (normalScale) {
      centerChildren(1)
    } else if (isCenter) {
      centerAndFit()
    } else {
      centerWithSpacing()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only init
  }, [])

  useEffect(() => {
    setPrevChild(prevChild)
    setNextChild(nextChild)
    setMoveToChild(moveToChild)
    setResetZoom(resetZoom)
    setZoomCentered(handleScaleCentered)
  }, [
    setPrevChild,
    setNextChild,
    setMoveToChild,
    setResetZoom,
    setZoomCentered,
    prevChild,
    nextChild,
    moveToChild,
    resetZoom,
    handleScaleCentered
  ])

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
    resetZoom,
    handleBoardDown,
    handleBoardMove,
    handleBoardUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}

export default useBoard
