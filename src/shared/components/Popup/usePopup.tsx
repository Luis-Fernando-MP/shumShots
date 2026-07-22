import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

export type PopupPositions = { x: number; y: number }

interface IUsePopupHook {
  isOpen: boolean
  clickPosition?: PopupPositions
  onClose: () => void
}

const usePopup = ({ isOpen, clickPosition, onClose }: IUsePopupHook) => {
  const $popupRef = useRef<HTMLElement>(null)
  const $dragPosition = useRef<PopupPositions | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<PopupPositions>({ x: 0, y: 0 })
  const bodyRect = document.documentElement.getBoundingClientRect()

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      requestAnimationFrame(() => {
        if (!isDragging || !$dragPosition.current || !$popupRef.current || !e.buttons) return
        e.preventDefault()
        const rect = $popupRef.current.getBoundingClientRect()
        const deltaX = e.clientX - $dragPosition.current.x
        const deltaY = e.clientY - $dragPosition.current.y
        const minX = 0
        const minY = 0
        const maxX = bodyRect.width - rect.width
        const maxY = bodyRect.height - rect.height
        $dragPosition.current = { x: e.clientX, y: e.clientY }
        setPosition(prev => {
          let newX = prev.x + deltaX
          let newY = prev.y + deltaY
          newX = Math.max(minX, Math.min(newX, maxX))
          newY = Math.max(minY, Math.min(newY, maxY))
          return { x: newX, y: newY }
        })
      })
    },
    [bodyRect, isDragging]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    $popupRef.current?.classList.remove('block-children-events')
  }, [])

  const bringPopupToFront = useCallback(() => {
    if (!$popupRef.current) return

    const popups = document.querySelectorAll('.popup')
    popups.forEach(popup => {
      if (!(popup instanceof HTMLElement)) return
      popup.style.zIndex = '10'
    })
    if ($popupRef.current) $popupRef.current.style.zIndex = '11'
  }, [$popupRef])

  const handleMouseDown = (e: MouseEvent) => {
    const moveOnHeader = (e.target as HTMLElement).closest('#popup-header')
    if (!$popupRef.current || (!moveOnHeader && !e.ctrlKey)) return
    if (e.ctrlKey) {
      $popupRef.current?.classList.add('block-children-events')
    }
    setIsDragging(true)
    bringPopupToFront()
    $dragPosition.current = { x: e.clientX, y: e.clientY }
  }

  const calculateInitialPosition = useCallback(
    (rect: DOMRect) => {
      if (!clickPosition) return

      $popupRef.current?.classList.add('animate')
      const { width: popupWidth, height: popupHeight } = rect
      const { width: innerWidth, height: innerHeight } = bodyRect
      let { x: newX, y: newY } = clickPosition

      if (newX === 0 && newY === 0) {
        newX = innerWidth / 2 - popupWidth / 2
        newY = innerHeight / 2 - popupHeight / 2
      } else {
        // Position popup 20px to the right of click position
        newX = clickPosition.x + 20
        newY = clickPosition.y
      }

      // Ensure popup stays within screen boundaries with 20px margin
      newX = Math.min(newX, innerWidth - popupWidth - 20)
      newY = Math.min(newY, innerHeight - popupHeight - 20)
      newX = Math.max(20, newX)
      newY = Math.max(20, newY)

      handleRemoveAnimatedClass()

      return { x: newX, y: newY }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bodyRect]
  )

  const handleRemoveAnimatedClass = useCallback(() => {
    if (!$popupRef.current) return

    const removeClass = () => {
      $popupRef.current?.classList.remove('animate')
      $popupRef.current?.removeEventListener('animationend', removeClass)
    }

    $popupRef.current.addEventListener('animationend', removeClass)
  }, [])

  useEffect(() => {
    bringPopupToFront()
  }, [isOpen, bringPopupToFront])

  useEffect(() => {
    if (!$popupRef.current || !isOpen) return
    const rect = $popupRef.current.getBoundingClientRect()
    const newPosition = calculateInitialPosition(rect)
    if (!newPosition) return
    if (position.x !== newPosition.x || position.y !== newPosition.y) {
      setPosition(newPosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !$popupRef.current) return
    const handleKeyEvent = (e: KeyboardEvent): void => {
      if (!(e.ctrlKey && (e.key === 'x' || e.key === 'Escape'))) return
      onClose()
    }
    $popupRef.current.addEventListener('keydown', handleKeyEvent)
    return () => {
      $popupRef.current?.removeEventListener('keydown', handleKeyEvent)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return {
    $popupRef,
    handleMouseDown,
    position,
    isDragging
  }
}

export default usePopup
