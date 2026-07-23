import Dropzone from '@/shared/components/Dropzone'
import usePictureCanvas from '@editor/hooks/usePictureCanvas'
import React, { type FC, useRef } from 'react'

import ApplyImageStyles from './ApplyImageStyles'
import PictureViewer from './PictureViewer'

const PictureCanvas: FC = () => {
  const $containerRef = useRef<HTMLDivElement>(null)

  const {
    scale,
    width,
    height,
    aspectRatio,
    currentPicture,
    isLoading,
    setIsLoading,
    handleLoadError,
    handleNewPicture,
    handleDropFile
  } = usePictureCanvas()

  return (
    <section
      ref={$containerRef}
      className='editor-image cvnPicture absolute top-1/2 left-1/2 size-auto origin-center rounded-radius'
      style={{ transform: `translate(-50%, -50%) scale(${scale})`, width: `${width}px`, height: `${height}px`, aspectRatio }}
    >
      <ApplyImageStyles $containerRef={$containerRef} />

      <PictureViewer
        imageUrl={currentPicture?.url}
        handleError={handleLoadError}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleImageClick={handleNewPicture}
      />

      {!currentPicture && <Dropzone onDrop={handleDropFile} maxFiles={1} />}
    </section>
  )
}

export default PictureCanvas
