'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

const POPUP_Z = String(APP_Z_INDEX.studio.popup)
const POPUP_FRONT_Z = String(APP_Z_INDEX.studio.popup + 1)

export type PopupPositions = { x: number; y: number }

interface IUsePopupHook {
  isOpen: boolean
  clickPosition?: PopupPositions
  onClose: () => void
}

const getViewportSize = () => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight
})

const calculatePosition = (rect: DOMRect, clickPosition?: PopupPositions): PopupPositions => {
  const { width: popupWidth, height: popupHeight } = rect
  const { width: innerWidth, height: innerHeight } = getViewportSize()

  let newX = clickPosition?.x ?? 0
  let newY = clickPosition?.y ?? 0

  if (!clickPosition || (newX === 0 && newY === 0)) {
    newX = innerWidth / 2 - popupWidth / 2
    newY = innerHeight / 2 - popupHeight / 2
  } else {
    newX = clickPosition.x + 20
    newY = clickPosition.y
  }

  newX = Math.min(newX, innerWidth - popupWidth - 20)
  newY = Math.min(newY, innerHeight - popupHeight - 20)
  newX = Math.max(20, newX)
  newY = Math.max(20, newY)

  return { x: newX, y: newY }
}

const usePopup = ({ isOpen, clickPosition, onClose }: IUsePopupHook) => {
  const $popupRef = useRef<HTMLElement | null>(null)
  const $dragPosition = useRef<PopupPositions | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [blockChildren, setBlockChildren] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false)
  const [position, setPosition] = useState<PopupPositions>({ x: 0, y: 0 })

  const placePopup = useCallback(
    (node: HTMLElement) => {
      const next = calculatePosition(node.getBoundingClientRect(), clickPosition)
      setPosition(next)
      setIsPositioned(true)
    },
    [clickPosition]
  )

  const setPopupRef = useCallback(
    (node: HTMLElement | null) => {
      $popupRef.current = node
      if (!node || !isOpen) return
      placePopup(node)
    },
    [isOpen, placePopup]
  )

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isDragging || !$dragPosition.current || !$popupRef.current || !e.buttons) return

    requestAnimationFrame(() => {
      if (!$dragPosition.current || !$popupRef.current) return
      e.preventDefault()

      const rect = $popupRef.current.getBoundingClientRect()
      const { width, height } = getViewportSize()
      const deltaX = e.clientX - $dragPosition.current.x
      const deltaY = e.clientY - $dragPosition.current.y
      $dragPosition.current = { x: e.clientX, y: e.clientY }

      setPosition(prev => ({
        x: Math.max(0, Math.min(prev.x + deltaX, width - rect.width)),
        y: Math.max(0, Math.min(prev.y + deltaY, height - rect.height))
      }))
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setBlockChildren(false)
  }, [])

  const bringPopupToFront = useCallback(() => {
    if (!$popupRef.current) return

    document.querySelectorAll('.popup').forEach(popup => {
      if (!(popup instanceof HTMLElement)) return
      popup.style.zIndex = POPUP_Z
    })
    $popupRef.current.style.zIndex = POPUP_FRONT_Z
  }, [])

  const handleMouseDown = (e: MouseEvent) => {
    const moveOnHeader = (e.target as HTMLElement).closest('#popup-header')
    if (!$popupRef.current || (!moveOnHeader && !e.ctrlKey)) return

    if (e.ctrlKey) setBlockChildren(true)
    setIsDragging(true)
    bringPopupToFront()
    $dragPosition.current = { x: e.clientX, y: e.clientY }
  }

  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false)
      return
    }
    bringPopupToFront()
    if ($popupRef.current) placePopup($popupRef.current)
  }, [isOpen, bringPopupToFront, placePopup])

  useEffect(() => {
    if (!isOpen || !$popupRef.current) return

    const handleKeyEvent = (e: KeyboardEvent): void => {
      if (!(e.ctrlKey && (e.key === 'x' || e.key === 'Escape'))) return
      onClose()
    }

    const node = $popupRef.current
    node.addEventListener('keydown', handleKeyEvent)
    return () => node.removeEventListener('keydown', handleKeyEvent)
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
    setPopupRef,
    handleMouseDown,
    position,
    isDragging,
    isPositioned,
    blockChildren
  }
}

export default usePopup
