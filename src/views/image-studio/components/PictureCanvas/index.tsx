'use client'

import Dropzone from '@/shared/components/Dropzone'
import { framesQuery } from '@common/core'
import { cn } from '@common/utils/cn'
import DeviceFrameShell from '@views/image-studio/components/PictureCanvas/DeviceFrameShell'
import PictureViewer from '@views/image-studio/components/PictureCanvas/PictureViewer'
import usePictureSlot from '@views/image-studio/hooks/usePictureSlot'
import { useShadowLightDom } from '@views/image-studio/hooks/useShadowLightDom'
import useFrameStore, { defaultSlotPan } from '@views/image-studio/Popups/FrameConfiguration/store'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { resolveSmoothCornerStyle } from '@views/image-studio/store/background/backgroundRadius.store'
import useImagesRadiusStore from '@views/image-studio/store/images/imagesRadius.store'
import usePicturesStore, { type PictureItem } from '@views/image-studio/store/images/pictures.store'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { getPictureLayout, type PictureLayoutRect } from '@views/image-studio/utils/pictureLayouts'
import { memo, useCallback, useMemo, useRef, useState, type CSSProperties, type FC } from 'react'

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

const PictureSlot = memo(function PictureSlot({
  picture,
  layout,
  canvasWidth,
  canvasHeight,
  selected
}: SlotProps) {
  const { isLoading, setIsLoading, handleLoadError, handleDropFile, handleSize, select, imageUrl } =
    usePictureSlot(picture.id)

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

  const fitMode = useFrameStore(s => s.fitMode)
  const slotPan = useFrameStore(s => s.slotPan)
  const objectPosition = slotPan[picture.id] ?? defaultSlotPan

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
  const edgePx = Math.min(boxWidth, boxHeight)

  const rootRef = useRef<HTMLDivElement>(null)
  const boxShadowRef = useRef<HTMLDivElement>(null)
  const lightsRef = useRef<HTMLDivElement>(null)
  const [filterTarget, setFilterTarget] = useState<HTMLImageElement | null>(null)
  const bindFilterTarget = useCallback((node: HTMLImageElement | null) => {
    setFilterTarget(node)
  }, [])

  const radiusCss = activeIndividualBorder
    ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    : `${borderRadiusValue}px`

  const cornerShapeCss = useMemo(
    () => resolveSmoothCornerStyle(borderSmooth).cornerShape,
    [borderSmooth]
  )
  const showMat = !hasDeviceFrame && matEnabled && matTop + matRight + matBottom + matLeft > 0
  const strokeWidth = hasDeviceFrame || type === 'none' ? 0 : size
  const matInset = showMat ? Math.min(matTop, matRight, matBottom, matLeft) : 0

  const effectiveRadiusCss = hasDeviceFrame ? '0px' : radiusCss
  const effectiveBorderType = hasDeviceFrame ? 'none' : type
  const effectiveBorderSize = hasDeviceFrame ? 0 : size

  const { contentFrameStyle, baseBoxShadow } = useMemo(() => {
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
    if (!hasDeviceFrame && cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    const base = typeof style.boxShadow === 'string' ? style.boxShadow : ''
    const { boxShadow: _ignored, ...withoutShadow } = style
    return { contentFrameStyle: withoutShadow as CSSProperties, baseBoxShadow: base }
  }, [
    blendMode,
    color,
    cornerShapeCss,
    effectiveBorderSize,
    effectiveBorderType,
    effectiveRadiusCss,
    finish,
    gradient,
    hasDeviceFrame
  ])

  useShadowLightDom({
    slotId: picture.id,
    edgePx,
    hasDeviceFrame,
    baseBoxShadow: hasDeviceFrame ? '' : baseBoxShadow,
    filterTarget: hasDeviceFrame ? filterTarget : null,
    rootRef,
    boxShadowRef,
    lightsRef
  })

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

  return (
    <div
      ref={rootRef}
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
        'absolute cursor-pointer overflow-visible outline-none',
        !hasDeviceFrame && 'rounded-sm',
        selected && 'z-10'
      )}
      style={{ left, top, width: boxWidth, height: boxHeight }}
    >
      <DeviceFrameShell
        frameId={picture.frameId}
        className='size-full overflow-visible'
        filterTargetRef={bindFilterTarget}
      >
        <div ref={boxShadowRef} className='relative size-full overflow-visible' style={contentFrameStyle}>
          <div className='relative size-full overflow-hidden' style={matStyle}>
            <div className='relative size-full overflow-hidden' style={contentStyle}>
              {imageUrl && (
                <PictureViewer
                  imageUrl={imageUrl}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onError={handleLoadError}
                  onSize={handleSize}
                  fitMode={hasDeviceFrame ? fitMode : 'cover'}
                  objectPosition={hasDeviceFrame ? objectPosition : { x: 0.5, y: 0.5 }}
                />
              )}
              <div ref={lightsRef} className='pointer-events-none absolute inset-0 z-[1]' />
              <Dropzone
                onDrop={handleDropFile}
                maxFiles={1}
                overlay={Boolean(imageUrl)}
                compact={hasDeviceFrame}
              />
            </div>
          </div>
        </div>
      </DeviceFrameShell>
    </div>
  )
})

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
