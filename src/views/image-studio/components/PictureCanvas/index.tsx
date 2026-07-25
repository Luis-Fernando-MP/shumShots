'use client'

import Dropzone from '@/shared/components/Dropzone'
import usePictureCanvas from '@views/image-studio/hooks/usePictureCanvas'
import { resolveSmoothCornerStyle } from '@views/image-studio/store/background/backgroundRadius.store'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import useShadowStore from '@views/image-studio/store/shadow/shadow.store'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { type CSSProperties, type FC, useMemo } from 'react'

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
  const borderSmooth = useImagesRadiusStore(s => s.borderSmooth)

  const color = useImagesBorderStore(s => s.color)
  const size = useImagesBorderStore(s => s.size)
  const type = useImagesBorderStore(s => s.type)
  const finish = useImagesBorderStore(s => s.finish)
  const gradient = useImagesBorderStore(s => s.gradient)
  const blendMode = useImagesBorderStore(s => s.blendMode)
  const matEnabled = useImagesBorderStore(s => s.matEnabled)
  const matColor = useImagesBorderStore(s => s.matColor)
  const matTop = useImagesBorderStore(s => s.matTop)
  const matRight = useImagesBorderStore(s => s.matRight)
  const matBottom = useImagesBorderStore(s => s.matBottom)
  const matLeft = useImagesBorderStore(s => s.matLeft)

  const dropShadow = useShadowStore(s => s.getShadowStyle())

  const radiusCss = activeIndividualBorder
    ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    : `${borderRadiusValue}px`

  const cornerShapeCss = useMemo(() => resolveSmoothCornerStyle(borderSmooth).cornerShape, [borderSmooth])

  const showMat = matEnabled && matTop + matRight + matBottom + matLeft > 0
  const strokeWidth = type === 'none' ? 0 : size
  const matInset = showMat ? Math.min(matTop, matRight, matBottom, matLeft) : 0

  const frameStyle = useMemo((): CSSProperties => {
    const style = buildCanvasFrameStyle({
      width,
      height,
      borderRadius: radiusCss,
      color,
      size,
      type,
      finish,
      gradient,
      blendMode
    })
    Object.assign(style, { aspectRatio, transform: 'translate(-50%, -50%)' })
    if (dropShadow) {
      style.boxShadow = [style.boxShadow, dropShadow].filter(Boolean).join(', ')
    }
    if (cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [
    aspectRatio,
    blendMode,
    color,
    cornerShapeCss,
    dropShadow,
    finish,
    gradient,
    height,
    radiusCss,
    size,
    type,
    width
  ])

  const matStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      boxSizing: 'border-box',
      borderRadius: insetBorderRadius(radiusCss, strokeWidth),
      padding: showMat ? `${matTop}px ${matRight}px ${matBottom}px ${matLeft}px` : 0,
      backgroundColor: showMat ? matColor : 'transparent'
    }
    if (cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [cornerShapeCss, matBottom, matColor, matLeft, matRight, matTop, radiusCss, showMat, strokeWidth])

  const contentStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      borderRadius: insetBorderRadius(radiusCss, strokeWidth + matInset)
    }
    if (cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [cornerShapeCss, matInset, radiusCss, strokeWidth])

  return (
    <section
      className='editor-image cvnPicture absolute top-1/2 left-1/2 size-auto origin-center'
      id='picture-image'
      style={frameStyle}
    >
      <div className='relative size-full' style={matStyle}>
        <div className='relative size-full overflow-hidden' style={contentStyle}>
          {currentPicture && (
            <PictureViewer
              imageUrl={currentPicture.url}
              handleError={handleLoadError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          <Dropzone onDrop={handleDropFile} maxFiles={1} overlay={Boolean(currentPicture)} />
        </div>
      </div>
    </section>
  )
}

export default PictureCanvas
