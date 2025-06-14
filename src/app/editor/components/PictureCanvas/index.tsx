import Dropzone, { DropzoneFile } from '@/shared/components/Dropzone'
import { toaster } from '@/shared/components/Toast'
import { HOST_URL } from '@/shared/constants'
import { useWorker } from '@koale/useworker'
import React, { type FC, memo, useCallback, useMemo, useState } from 'react'

import uploadImage from '../../workers/upload.worker'
import PictureViewer from './PictureViewer'
import './style.scss'

interface Props {
  image: string | null
  addPicture: (picture: any) => void
  transform: string
}

const PictureCanvas: FC<Props> = ({ image, addPicture, transform }) => {
  console.log('update')
  const [upload] = useWorker(uploadImage)

  const [currentPicture, setCurrentPicture] = useState(image)
  const [isLoading, setIsLoading] = useState(true)

  const sendImage = useCallback(
    async (file: DropzoneFile) => {
      try {
        const result = await upload(file, `${HOST_URL}/api/upload`)
        if (result instanceof Error) throw result
        addPicture({ url: result.original_image })
      } catch (error) {
        toaster({
          title: 'Error de subida',
          description: 'Puedes usar la aplicación de forma offline o intenta subir una nueva imagen',
          type: 'error',
          id: 'upload-error'
        })
      }
    },
    [upload, addPicture]
  )

  const handleLoadError = (): void => {
    toaster({
      title: 'Error de carga',
      description: 'Tu imagen temporal no se pudo cargar, intenta subir una nueva imagen',
      type: 'warning',
      id: 'load-error'
    })
    setCurrentPicture(null)
    setIsLoading(false)
  }

  const handleDropFile = useCallback(
    (files: DropzoneFile[]) => {
      setIsLoading(true)
      setCurrentPicture(files[0].preview)
      sendImage(files[0])
    },
    [sendImage]
  )

  const dropZone = useMemo(() => {
    return (
      <div className='cvnPicture cvnPicture-dropzone' style={{ transform }}>
        <Dropzone onDrop={handleDropFile} maxFiles={1} removeAfterUpload />
      </div>
    )
  }, [handleDropFile, transform])

  return (
    <>
      <PictureViewer
        imageUrl={currentPicture}
        handleError={handleLoadError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleImageClick={() => {}}
      />
      {!currentPicture && dropZone}
    </>
  )
}

export default memo(PictureCanvas, (prev, next) => prev.image === next.image)
