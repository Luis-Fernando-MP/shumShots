import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import useBoardStore, {
  MAX_SCALE,
  MIN_SCALE,
  Positions,
  SCALE_EPSILON,
  WHEEL_ZOOM_INTENSITY,
  ZoomDirection,
  snapOffset
} from './board.store'

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

const ZOOM_IDLE_MS = 120

const clampScale = (scale: number) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale))

const applySurfaceTransform = (el: HTMLElement | null, scale: number, offset: Positions) => {
  if (!el) return
  el.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`
}

const useBoard = ({ isCenter, minScale = false, normalScale = false }: IUseBoardHook) => {
  const offset = useBoardStore(s => s.offset)
  const scale = useBoardStore(s => s.scale)
  const enableScroll = useBoardStore(s => s.enableScroll)
  const snapToGrid = useBoardStore(s => s.snapToGrid)
  const gridSize = useBoardStore(s => s.gridSize)
  const setOffset = useBoardStore(s => s.setOffset)
  const setScale = useBoardStore(s => s.setScale)
  const setScaleCentered = useBoardStore(s => s.setScaleCentered)
  const setScaleAndOffset = useBoardStore(s => s.setScaleAndOffset)
  const setPrevChild = useBoardStore(s => s.setPrevChild)
  const setNextChild = useBoardStore(s => s.setNextChild)
  const setMoveToChild = useBoardStore(s => s.setMoveToChild)
  const setResetZoom = useBoardStore(s => s.setResetZoom)
  const setZoomCentered = useBoardStore(s => s.setZoomCentered)

  const $containerRef = useRef<HTMLDivElement>(null)
  const $childrenRef = useRef<HTMLDivElement>(null)

  const [isMoving, setIsMoving] = useState(false)
  const [childIndex, setChildIndex] = useState(0)

  const liveRef = useRef({ scale: 1, offset: { x: 0, y: 0 } })
  const snapRef = useRef({ snapToGrid, gridSize })
  snapRef.current = { snapToGrid, gridSize }

  const resolvePanOffset = (next: Positions) => {
    const snap = snapRef.current
    return snapOffset(next, snap.snapToGrid ? snap.gridSize : undefined)
  }
  const panRef = useRef<{ active: boolean; lastX: number; lastY: number; rawX: number; rawY: number }>({
    active: false,
    lastX: 0,
    lastY: 0,
    rawX: 0,
    rawY: 0
  })
  const panRafRef = useRef<number | null>(null)
  const zoomRafRef = useRef<number | null>(null)
  const zoomIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const zoomingRef = useRef(false)

  const setZoomingClass = (active: boolean) => {
    $containerRef.current?.classList.toggle('is-zooming', active)
  }

  // Transform solo por DOM: React no debe pisar el zoom en curso.
  useLayoutEffect(() => {
    if (zoomingRef.current || panRef.current.active) return
    liveRef.current = { scale, offset }
    applySurfaceTransform($childrenRef.current, scale, offset)
  }, [scale, offset])

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

  const flushZoomToStore = useCallback(
    (snap: boolean) => {
      const live = liveRef.current
      const nextOffset = snap ? snapOffset(live.offset) : live.offset
      if (snap) live.offset = nextOffset
      setScaleAndOffset(live.scale, nextOffset)
      if (snap) applySurfaceTransform($childrenRef.current, live.scale, nextOffset)
    },
    [setScaleAndOffset]
  )

  const endZoomGesture = useCallback(() => {
    if (zoomRafRef.current != null) {
      cancelAnimationFrame(zoomRafRef.current)
      zoomRafRef.current = null
    }
    zoomingRef.current = false
    setZoomingClass(false)
    flushZoomToStore(true)
  }, [flushZoomToStore])

  const handleBoardDown = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      setIsMoving(true)
      panRef.current = {
        active: true,
        lastX: e.clientX,
        lastY: e.clientY,
        rawX: liveRef.current.offset.x,
        rawY: liveRef.current.offset.y
      }
    }
  }

  const handleBoardMove = useCallback((e: React.MouseEvent) => {
    if (!panRef.current.active) return

    const clientX = e.clientX
    const clientY = e.clientY

    if (panRafRef.current != null) cancelAnimationFrame(panRafRef.current)
    panRafRef.current = requestAnimationFrame(() => {
      panRafRef.current = null
      const pan = panRef.current
      if (!pan.active) return

      const deltaX = clientX - pan.lastX
      const deltaY = clientY - pan.lastY
      pan.lastX = clientX
      pan.lastY = clientY
      pan.rawX += deltaX
      pan.rawY += deltaY

      const live = liveRef.current
      live.offset = resolvePanOffset({ x: pan.rawX, y: pan.rawY })
      applySurfaceTransform($childrenRef.current, live.scale, live.offset)
    })
  }, [])

  const handleBoardUp = useCallback(() => {
    if (!panRef.current.active && !isMoving) return
    panRef.current.active = false
    setIsMoving(false)
    if (panRafRef.current != null) {
      cancelAnimationFrame(panRafRef.current)
      panRafRef.current = null
    }
    const snapped = resolvePanOffset(liveRef.current.offset)
    liveRef.current.offset = snapped
    applySurfaceTransform($childrenRef.current, liveRef.current.scale, snapped)
    setOffset(snapped)
  }, [isMoving, setOffset])

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

  const nextChild = useCallback(() => {
    moveToChild(childIndex + 1)
  }, [childIndex, moveToChild])

  const prevChild = useCallback(() => {
    moveToChild(childIndex - 1)
  }, [childIndex, moveToChild])

  useEffect(() => {
    const canvas = $containerRef.current
    if (!canvas || enableScroll) return

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return
      e.preventDefault()

      const surface = $childrenRef.current
      if (!surface) return

      const live = liveRef.current
      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 16
      else if (e.deltaMode === 2) dy *= canvas.clientHeight

      const nextScale = clampScale(live.scale * Math.exp(-dy * WHEEL_ZOOM_INTENSITY))
      if (Math.abs(nextScale - live.scale) < SCALE_EPSILON) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = (e.clientX - rect.left - live.offset.x) / live.scale
      const mouseY = (e.clientY - rect.top - live.offset.y) / live.scale
      const nextOffset = {
        x: live.offset.x - mouseX * (nextScale - live.scale),
        y: live.offset.y - mouseY * (nextScale - live.scale)
      }

      live.scale = nextScale
      live.offset = nextOffset
      applySurfaceTransform(surface, nextScale, nextOffset)

      if (!zoomingRef.current) {
        zoomingRef.current = true
        setZoomingClass(true)
      }

      if (zoomIdleTimerRef.current != null) clearTimeout(zoomIdleTimerRef.current)
      zoomIdleTimerRef.current = setTimeout(endZoomGesture, ZOOM_IDLE_MS)
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      canvas.removeEventListener('wheel', onWheel)
      if (zoomIdleTimerRef.current != null) clearTimeout(zoomIdleTimerRef.current)
      if (zoomRafRef.current != null) cancelAnimationFrame(zoomRafRef.current)
    }
  }, [enableScroll, endZoomGesture])

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
      if (panRafRef.current != null) cancelAnimationFrame(panRafRef.current)
      if (zoomRafRef.current != null) cancelAnimationFrame(zoomRafRef.current)
      if (zoomIdleTimerRef.current != null) clearTimeout(zoomIdleTimerRef.current)
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
