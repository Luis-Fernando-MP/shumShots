'use client'

import Dropzone from '@/shared/components/Dropzone'
import { framesQuery } from '@common/core'
import { cn } from '@common/utils/cn'
import useFrameStore, { createDefaultFrameConfig } from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import DeviceFrameShell from '@views/image-studio/canvas/PictureCanvas/DeviceFrameShell'
import PictureViewer from '@views/image-studio/canvas/PictureCanvas/PictureViewer'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { layerAppliesTo } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'
import usePictureSlot from '@views/image-studio/canvas/PictureCanvas/hooks/usePictureSlot'
import { useShadowLightDom } from '@views/image-studio/canvas/PictureCanvas/hooks/useShadowLightDom'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { getPositionEntry } from '@views/image-studio/Popups/CanvasImages/ImagesCount/presets/positions/data'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { resolveSmoothCornerStyle } from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import useCornerStore, { createDefaultCornerConfig } from '@views/image-studio/Popups/CanvasImages/Corner/store/corner/store'
import useGridStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/grid'
import usePicturesStore, { type PictureItem } from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useSizeStore, { resolveSlotSizeFromState } from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { type CSSProperties, type FC, memo, useCallback, useMemo, useRef, useState } from 'react'

const fitFrameInSlot = (slot: { left: number; top: number; width: number; height: number }, aspect: number) => {
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

const resolveLayerIdForSlot = (layers: { id: string; targetIds: string[] }[], slotId: string) => {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i]
    if (!layerAppliesTo(layer.targetIds, slotId)) continue
    return layer.id
  }
  return null
}

type SlotProps = {
  picture: PictureItem
  left: number
  top: number
  slotWidth: number
  slotHeight: number
  rotateZ: number
  rotateX: number
  rotateY: number
  zIndex: number
  selected: boolean
}

const PictureSlot = memo(function PictureSlot({
  picture,
  left: slotLeft,
  top: slotTop,
  slotWidth,
  slotHeight,
  rotateZ,
  rotateX,
  rotateY,
  zIndex,
  selected
}: SlotProps) {
  const { isLoading, setIsLoading, handleLoadError, handleDropFile, handleSize, select, imageUrl } = usePictureSlot(picture.id)

  const cornerLayers = getTabsStore(TABS_SCOPES.corner)(s => s.layers)
  const cornerTabId = useMemo(() => resolveLayerIdForSlot(cornerLayers, picture.id), [cornerLayers, picture.id])
  const defaultCorner = useMemo(() => createDefaultCornerConfig(), [])
  const corner = useCornerStore(s => (cornerTabId ? s.byTab[cornerTabId] : undefined) ?? defaultCorner)
  const {
    activeIndividualBorder,
    borderRadius: borderRadiusValue,
    borderLTRadius,
    borderRTRadius,
    borderRBRadius,
    borderLBRadius,
    borderSmooth
  } = corner.radius
  const { color, size, type, finish, gradient, blendMode, matEnabled, matColor, matTop, matRight, matBottom, matLeft } =
    corner.border

  const frameLayers = getTabsStore(TABS_SCOPES.frame)(s => s.layers)
  const frameTabId = useMemo(() => resolveLayerIdForSlot(frameLayers, picture.id), [frameLayers, picture.id])
  const defaultFrame = useMemo(() => createDefaultFrameConfig(), [])
  const frameConfig = useFrameStore(s => (frameTabId ? s.byTab[frameTabId] : undefined) ?? defaultFrame)
  const resolvedFrameId = frameConfig.frameId

  const { data: framesData } = framesQuery.list()
  const catalogFrame = resolvedFrameId ? (framesData?.data?.frames.find(item => item.id === resolvedFrameId) ?? null) : null
  const frameAspect = catalogFrame?.aspect ?? null
  const hasDeviceFrame = Boolean(catalogFrame)

  const frameBox = useMemo(() => {
    const slot = { left: 0, top: 0, width: slotWidth, height: slotHeight }
    if (!frameAspect || frameAspect <= 0) return slot
    return fitFrameInSlot(slot, frameAspect)
  }, [frameAspect, slotHeight, slotWidth])

  const { left, top, width: boxWidth, height: boxHeight } = frameBox
  const edgePx = Math.min(boxWidth, boxHeight)
  const has3d = rotateX !== 0 || rotateY !== 0
  const transform = [
    has3d ? `perspective(900px)` : '',
    `rotateX(${rotateX}deg)`,
    `rotateY(${rotateY}deg)`,
    `rotateZ(${rotateZ}deg)`
  ]
    .filter(Boolean)
    .join(' ')

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

  const cornerShapeCss = useMemo(() => resolveSmoothCornerStyle(borderSmooth).cornerShape, [borderSmooth])
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
    const nextStyle = { ...style }
    delete nextStyle.boxShadow
    return { contentFrameStyle: nextStyle as CSSProperties, baseBoxShadow: base }
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
  }, [cornerShapeCss, effectiveRadiusCss, hasDeviceFrame, matBottom, matColor, matLeft, matRight, matTop, showMat, strokeWidth])

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
      className={cn('absolute cursor-pointer overflow-visible outline-none', !hasDeviceFrame && 'rounded-sm', selected && 'z-10')}
      style={{
        left: slotLeft + left,
        top: slotTop + top,
        width: boxWidth,
        height: boxHeight,
        zIndex,
        transform,
        transformOrigin: 'center center'
      }}
    >
      <DeviceFrameShell frameId={resolvedFrameId} className='size-full overflow-visible' filterTargetRef={bindFilterTarget}>
        <div ref={boxShadowRef} className='relative size-full overflow-visible' style={contentFrameStyle}>
          <div className='relative size-full overflow-hidden' style={matStyle}>
            <div className='relative size-full overflow-hidden' style={contentStyle}>
              {imageUrl && (
                <PictureViewer
                  slotId={picture.id}
                  frameActive={hasDeviceFrame}
                  imageUrl={imageUrl}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onError={handleLoadError}
                  onSize={handleSize}
                />
              )}
              <div ref={lightsRef} className='pointer-events-none absolute inset-0 z-[1]' />
              <Dropzone onDrop={handleDropFile} maxFiles={1} overlay={Boolean(imageUrl)} compact={hasDeviceFrame} />
            </div>
          </div>
        </div>
      </DeviceFrameShell>
    </div>
  )
})

const PictureCanvas: FC = () => {
  const pictures = usePicturesStore(s => s.pictures)
  const selectedId = usePicturesStore(s => s.selectedId)
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const sizeLayers = useSizeStore(s => s.layers)
  const constrainToParent = useGridStore(s => s.constrainToParent)
  const positionId = useGridStore(s => s.positionId)

  const placements = useMemo(() => {
    const slotSizes = pictures.map(picture => resolveSlotSizeFromState(sizeLayers, picture.id))
    const entry = getPositionEntry(positionId, pictures.length)
    return entry.builder({
      count: pictures.length,
      canvasWidth: backgroundWidth,
      canvasHeight: backgroundHeight,
      slotSizes,
      constrainToParent
    })
  }, [backgroundHeight, backgroundWidth, constrainToParent, pictures, positionId, sizeLayers])

  return (
    <div className='pointer-events-none absolute inset-0' id='picture-canvas-layer'>
      <div className='pointer-events-auto relative size-full'>
        {pictures.map((picture, index) => {
          const placement = placements[index]
          if (!placement) return null
          return (
            <PictureSlot
              key={picture.id}
              picture={picture}
              left={placement.x}
              top={placement.y}
              slotWidth={placement.width}
              slotHeight={placement.height}
              rotateZ={placement.rotateZ}
              rotateX={placement.rotateX}
              rotateY={placement.rotateY}
              zIndex={placement.zIndex}
              selected={picture.id === selectedId}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PictureCanvas
