'use client'

import type { DropzoneFile } from '@/shared/components/Dropzone'
import { toaster } from '@common/ui/Toast'
import useLibraryImageSrc from '@views/image-studio/hooks/useLibraryImageSrc'
import useImageLibraryStore from '@views/image-studio/store/images/imageLibrary.store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { importStudioImage } from '@views/image-studio/utils/imageLibrary'
import { useCallback, useState } from 'react'

const usePictureSlot = (pictureId: string) => {
  const libraryId = usePicturesStore(
    s => s.pictures.find(item => item.id === pictureId)?.libraryId ?? null
  )
  const setLibraryId = usePicturesStore(s => s.setLibraryId)
  const setPictureSize = usePicturesStore(s => s.setPictureSize)
  const setSelected = usePicturesStore(s => s.setSelected)
  const isActive = useImageLibraryStore(s =>
    libraryId ? (s.images.find(item => item.id === libraryId)?.active ?? false) : false
  )
  const imageSrc = useLibraryImageSrc(libraryId, isActive)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadError = useCallback(() => {
    toaster({ title: 'Carga una nueva imagen', type: 'error', id: `load-error-${pictureId}` })
    setLibraryId(pictureId, null)
    setIsLoading(false)
  }, [pictureId, setLibraryId])

  const handleDropFile = useCallback(
    async (files: DropzoneFile[]) => {
      const file = files[0]
      if (!file) return

      setIsLoading(true)
      setSelected(pictureId)
      try {
        const entry = await importStudioImage(file)
        setLibraryId(pictureId, entry.id)
        setPictureSize(pictureId, {
          width: entry.width,
          height: entry.height,
          aspectRatio: entry.width / Math.max(1, entry.height)
        })
      } catch (error) {
        console.error(error)
        toaster({ title: 'No se pudo cargar la imagen', type: 'error' })
        setLibraryId(pictureId, null)
      } finally {
        setIsLoading(false)
      }
    },
    [pictureId, setLibraryId, setPictureSize, setSelected]
  )

  const handleSize = useCallback(
    (size: { width: number; height: number; aspectRatio: number }) => {
      setPictureSize(pictureId, size)
    },
    [pictureId, setPictureSize]
  )

  const select = useCallback(() => setSelected(pictureId), [pictureId, setSelected])

  return {
    imageUrl: isActive ? imageSrc : null,
    isLoading,
    setIsLoading,
    handleLoadError,
    handleDropFile,
    handleSize,
    select
  }
}

export default usePictureSlot
