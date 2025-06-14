import { DropzoneFile } from '@/shared/components/Dropzone'
import { toaster } from '@/shared/components/Toast'
import { HOST_URL } from '@/shared/constants'
import { useWorker } from '@koale/useworker'
import { MouseEvent, useCallback, useState } from 'react'

import usePicturesStore from '../store/images/pictures.store'
import uploadImage from '../workers/upload.worker'

const usePictureCanvas = () => {
  const { getCurrentPicture, addPicture, pictures } = usePicturesStore()

  console.log('pictures', pictures)

  const [currentPicture, setCurrentPicture] = useState(getCurrentPicture())
  const [isLoading, setIsLoading] = useState(true)

  const [upload] = useWorker(uploadImage)

  const sendImage = useCallback(
    async (file: DropzoneFile) => {
      try {
        const result = await upload(file, `${HOST_URL}/api/upload`)
        if (result instanceof Error) throw result
        addPicture({ url: result.original_image })
      } catch (error) {
        toaster({ title: 'Error al subir la imagen', type: 'error', id: 'upload-error' })
      }
    },
    [upload, addPicture]
  )

  const handleLoadError = (): void => {
    toaster({ title: 'Carga una nueva imagen', type: 'error', id: 'load-error' })
    setCurrentPicture(null)
    setIsLoading(false)
  }

  const handleNewPicture = (e: MouseEvent) => {
    e.preventDefault()
    // TODO: Abrir el modal para subir nuevas imágenes
    console.log('pictures----------------------', pictures)
  }

  const handleDropFile = useCallback(
    (files: DropzoneFile[]) => {
      setIsLoading(true)
      setCurrentPicture({ url: files[0].preview })
      sendImage(files[0])
    },
    [sendImage]
  )

  return {
    currentPicture,
    isLoading,
    pictures,
    setIsLoading,
    handleLoadError,
    handleNewPicture,
    handleDropFile
  }
}

export default usePictureCanvas
