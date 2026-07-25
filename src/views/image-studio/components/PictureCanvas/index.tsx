'use client'

import Dropzone from '@/shared/components/Dropzone'
import usePictureCanvas from '@views/image-studio/hooks/usePictureCanvas'
import { type CSSProperties, type FC, useMemo } from 'react'

import useImagesRadiusStore from '../../store/images/imagesRadius.store'
import useImagesBorderStore from '../../store/images/useImagesBorderStore'
import useShadowStore from '../../store/shadow/shadow.store'
import PictureViewer from './PictureViewer'

const PictureCanvas: FC = () => {
  const { width, height, aspectRatio, currentPicture, isLoading, setIsLoading, handleLoadError, handleDropFile } =
    usePictureCanvas()

  const activeIndividualBorder = useImagesRadiusStore(s => s.activeIndividualBorder)
  const borderRadiusValue = useImagesRadiusStore(s => s.borderRadius)
  const borderLTRadius = useImagesRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useImagesRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useImagesRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useImagesRadiusStore(s => s.borderLBRadius)

  const color = useImagesBorderStore(s => s.color)
  const size = useImagesBorderStore(s => s.size)
  const type = useImagesBorderStore(s => s.type)
  const gradient = useImagesBorderStore(s => s.gradient)
  const boxSizing = useImagesBorderStore(s => s.boxSizing)
  const blendMode = useImagesBorderStore(s => s.blendMode)

  const boxShadow = useShadowStore(s => s.getShadowStyle())

  const frameStyle = useMemo((): CSSProperties => {
    const borderRadius = activeIndividualBorder
      ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
      : `${borderRadiusValue}px`

    let borderStyles: CSSProperties = {
      border: 'none',
      background: 'none',
      boxSizing: 'border-box',
      backgroundBlendMode: 'normal'
    }

    if (type === 'solid') {
      borderStyles = {
        border: `${size}px solid ${color}`,
        background: 'none',
        boxSizing,
        backgroundBlendMode: 'normal'
      }
    } else if (type === 'gradient' && gradient) {
      borderStyles = {
        background: gradient,
        border: `${size}px solid transparent`,
        boxSizing,
        backgroundClip: 'border-box',
        backgroundBlendMode: blendMode
      }
    }

    return {
      width,
      height,
      aspectRatio,
      transform: 'translate(-50%, -50%)',
      borderRadius,
      boxShadow,
      ...borderStyles
    }
  }, [
    activeIndividualBorder,
    aspectRatio,
    blendMode,
    borderLBRadius,
    borderLTRadius,
    borderRBRadius,
    borderRTRadius,
    borderRadiusValue,
    boxShadow,
    boxSizing,
    color,
    gradient,
    height,
    size,
    type,
    width
  ])

  return (
    <section
      className='editor-image cvnPicture absolute top-1/2 left-1/2 size-auto origin-center overflow-hidden'
      id='picture-image'
      style={frameStyle}
    >
      {currentPicture && (
        <PictureViewer
          imageUrl={currentPicture.url}
          handleError={handleLoadError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}

      <Dropzone onDrop={handleDropFile} maxFiles={1} overlay={Boolean(currentPicture)} />
    </section>
  )
}

export default PictureCanvas
