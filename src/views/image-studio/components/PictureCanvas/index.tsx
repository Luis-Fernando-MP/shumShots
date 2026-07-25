'use client'

import Dropzone from '@/shared/components/Dropzone'
import { framesQuery } from '@common/core'
import { cn } from '@common/utils/cn'
import DeviceFrameShell from '@views/image-studio/components/PictureCanvas/DeviceFrameShell'
import PictureViewer from '@views/image-studio/components/PictureCanvas/PictureViewer'
import usePictureSlot from '@views/image-studio/hooks/usePictureSlot'
import { useShadowVisualStyles } from '@views/image-studio/hooks/useShadowVisualStyles'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { resolveSmoothCornerStyle } from '@views/image-studio/store/background/backgroundRadius.store'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import usePicturesStore, { type PictureItem } from '@views/image-studio/store/images/pictures.store'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { getPictureLayout, type PictureLayoutRect } from '@views/image-studio/utils/pictureLayouts'
import { type CSSProperties, type FC, useMemo } from 'react'

const fitFrameInSlot = (
  slot: { left: number; top: number; width: number; height: number },
  aspect: number
) => {
  const slotAspect = slot.width / Math.max(1, slot.height)
  let width = slot.width
  let height = slot.height

  if (slotAspect > aspect) {
    height = slot.height
    width = slot.height * aspect
  } else {
    width = slot.width
    height = slot.width / aspect
  }

  return {
    left: slot.left + (slot.width - width) / 2,
    top: slot.top + (slot.height - height) / 2,
    width,
    height
  }
}

type SlotProps = {
  picture: PictureItem
  layout: PictureLayoutRect
  canvasWidth: number
  canvasHeight: number
  selected: boolean
}

const PictureSlot: FC<SlotProps> = ({ picture, layout, canvasWidth, canvasHeight, selected }) => {
  const { isLoading, setIsLoading, handleLoadError, handleDropFile, handleSize, select } = usePictureSlot(
    picture.id
  )

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

  const { boxShadow, dropShadowFilter, lightOverlay } = useShadowVisualStyles()
  const { data: framesData } = framesQuery.list()
  const catalogFrame = picture.frameId
    ? (framesData?.data?.frames.find(item => item.id === picture.frameId) ?? null)
    : null
  const frameAspect = catalogFrame?.aspect ?? null
  const hasDeviceFrame = Boolean(catalogFrame)

  const slotWidth = (layout.w / 100) * canvasWidth
  const slotHeight = (layout.h / 100) * canvasHeight
  const slotLeft = (layout.x / 100) * canvasWidth
  const slotTop = (layout.y / 100) * canvasHeight

  const frameBox = useMemo(() => {
    const slot = { left: slotLeft, top: slotTop, width: slotWidth, height: slotHeight }
    if (!frameAspect || frameAspect <= 0) return slot
    return fitFrameInSlot(slot, frameAspect)
  }, [frameAspect, slotHeight, slotLeft, slotTop, slotWidth])

  const { left, top, width: boxWidth, height: boxHeight } = frameBox

  const radiusCss = activeIndividualBorder
    ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    : `${borderRadiusValue}px`

  const cornerShapeCss = useMemo(() => resolveSmoothCornerStyle(borderSmooth).cornerShape, [borderSmooth])
  const showMat = !hasDeviceFrame && matEnabled && matTop + matRight + matBottom + matLeft > 0
  const strokeWidth = hasDeviceFrame || type === 'none' ? 0 : size
  const matInset = showMat ? Math.min(matTop, matRight, matBottom, matLeft) : 0

  const effectiveRadiusCss = hasDeviceFrame ? '0px' : radiusCss
  const effectiveBorderType = hasDeviceFrame ? 'none' : type
  const effectiveBorderSize = hasDeviceFrame ? 0 : size

  const contentFrameStyle = useMemo((): CSSProperties => {
    const style = buildCanvasFrameStyle({
      width: '100%',
      height: '100%',
      borderRadius: effectiveRadiusCss,
      color,
      size: effectiveBorderSize,
      type: effectiveBorderType,
      finish,
      gradient,
      blendMode
    })
    if (!hasDeviceFrame && boxShadow) {
      style.boxShadow = [style.boxShadow, boxShadow].filter(Boolean).join(', ')
    }
    if (!hasDeviceFrame && cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [
    blendMode,
    boxShadow,
    color,
    cornerShapeCss,
    effectiveBorderSize,
    effectiveBorderType,
    effectiveRadiusCss,
    finish,
    gradient,
    hasDeviceFrame
  ])

  const matStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      boxSizing: 'border-box',
      borderRadius: insetBorderRadius(effectiveRadiusCss, strokeWidth),
      padding: showMat ? `${matTop}px ${matRight}px ${matBottom}px ${matLeft}px` : 0,
      backgroundColor: showMat ? matColor : 'transparent',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }
    if (!hasDeviceFrame && cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [
    cornerShapeCss,
    effectiveRadiusCss,
    hasDeviceFrame,
    matBottom,
    matColor,
    matLeft,
    matRight,
    matTop,
    showMat,
    strokeWidth
  ])

  const contentStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      borderRadius: insetBorderRadius(effectiveRadiusCss, strokeWidth + matInset),
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }
    if (!hasDeviceFrame && cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [cornerShapeCss, effectiveRadiusCss, hasDeviceFrame, matInset, strokeWidth])

  const shellStyle = useMemo((): CSSProperties => {
    if (hasDeviceFrame || !boxShadow) return {}
    return { overflow: 'visible' }
  }, [boxShadow, hasDeviceFrame])

  const showShadow = Boolean(hasDeviceFrame ? dropShadowFilter : boxShadow)

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={select}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          select()
        }
      }}
      className={cn(
        'absolute cursor-pointer outline-none',
        showShadow ? 'overflow-visible' : 'overflow-hidden',
        !hasDeviceFrame && 'rounded-sm',
        selected && 'z-10'
      )}
      style={{ left, top, width: boxWidth, height: boxHeight }}
    >
      <DeviceFrameShell
        frameId={picture.frameId}
        className='size-full'
        style={shellStyle}
        dropShadowFilter={hasDeviceFrame ? dropShadowFilter : undefined}
      >
        <div
          className='relative size-full'
          style={{
            ...contentFrameStyle,
            overflow: !hasDeviceFrame && boxShadow ? 'visible' : 'hidden'
          }}
        >
          <div className='relative size-full overflow-hidden' style={matStyle}>
            <div className='relative size-full' style={contentStyle}>
              {picture.url && (
                <PictureViewer
                  imageUrl={picture.url}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onError={handleLoadError}
                  onSize={handleSize}
                />
              )}
              {lightOverlay && (
                <div className='pointer-events-none absolute inset-0 z-[1]' style={lightOverlay} />
              )}
              <Dropzone
                onDrop={handleDropFile}
                maxFiles={1}
                overlay={Boolean(picture.url)}
                compact={hasDeviceFrame}
              />
            </div>
          </div>
        </div>
      </DeviceFrameShell>
    </div>
  )
}

const PictureCanvas: FC = () => {
  const pictures = usePicturesStore(s => s.pictures)
  const count = usePicturesStore(s => s.count)
  const selectedId = usePicturesStore(s => s.selectedId)
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)

  const layout = useMemo(() => getPictureLayout(count), [count])

  return (
    <div className='pointer-events-none absolute inset-0' id='picture-canvas-layer'>
      <div className='pointer-events-auto relative size-full'>
        {pictures.map((picture, index) => {
          const rect = layout[index]
          if (!rect) return null
          return (
            <PictureSlot
              key={picture.id}
              picture={picture}
              layout={rect}
              canvasWidth={backgroundWidth}
              canvasHeight={backgroundHeight}
              selected={picture.id === selectedId}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PictureCanvas
