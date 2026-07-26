'use client'

import ShumShots from '@/shared/ui/ShumShots'
import useFrameStore, {
  defaultSlotPan
} from '@views/image-studio/Popups/FrameConfiguration/store'
import { type FC, useEffect, useLayoutEffect, useRef } from 'react'

type Props = {
  slotId: string
  frameActive: boolean
  imageUrl?: string | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  onError: () => void
  onSize: (size: { width: number; height: number; aspectRatio: number }) => void
}

const PictureViewer: FC<Props> = ({
  slotId,
  frameActive,
  imageUrl,
  isLoading,
  setIsLoading,
  onError,
  onSize
}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const onErrorRef = useRef(onError)
  const onSizeRef = useRef(onSize)
  const setIsLoadingRef = useRef(setIsLoading)
  const lastSizeKey = useRef('')

  onErrorRef.current = onError
  onSizeRef.current = onSize
  setIsLoadingRef.current = setIsLoading

  useEffect(() => {
    if (!imageUrl) return

    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      const { naturalWidth, naturalHeight } = image
      const aspectRatio = naturalWidth / Math.max(1, naturalHeight)
      const key = `${naturalWidth}x${naturalHeight}`
      if (lastSizeKey.current !== key) {
        lastSizeKey.current = key
        onSizeRef.current({ width: naturalWidth, height: naturalHeight, aspectRatio })
      }
      setIsLoadingRef.current(false)
    }
    image.onerror = () => onErrorRef.current()

    return () => {
      image.onload = null
      image.onerror = null
    }
  }, [imageUrl])

  useLayoutEffect(() => {
    const apply = (state = useFrameStore.getState()) => {
      const image = imageRef.current
      if (!image) return

      const fitMode = frameActive ? state.fitMode : 'cover'
      const position = frameActive ? (state.slotPan[slotId] ?? defaultSlotPan) : defaultSlotPan
      const objectPosition = `${position.x * 100}% ${position.y * 100}%`

      if (image.style.objectFit !== fitMode) image.style.objectFit = fitMode
      if (image.style.objectPosition !== objectPosition) {
        image.style.objectPosition = objectPosition
      }
    }

    apply()
    return useFrameStore.subscribe(apply)
  }, [frameActive, slotId])

  if (!imageUrl) return null

  if (isLoading) {
    return (
      <div className='absolute inset-0 grid size-full place-content-center bg-background/40'>
        <ShumShots size='lg' radius='none' transparent />
      </div>
    )
  }

  return (
    <img
      ref={imageRef}
      src={imageUrl}
      className='pointer-events-none absolute inset-0 size-full'
      alt='Imagen del shot'
      decoding='async'
      draggable={false}
      onError={onError}
    />
  )
}

export default PictureViewer
