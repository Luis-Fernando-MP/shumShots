'use client'

import useBoardStore from '@common/components/Board/board.store'
import Dropzone from '@common/components/Dropzone'
import APP_Z_INDEX from '@common/constants/z-index'
import { framesQuery } from '@common/core'
import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { resolveSmoothCornerStyle } from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import useCornerStore, { createDefaultCornerConfig } from '@views/image-studio/Popups/CanvasImages/Corner/store/corner/store'
import useFrameStore, { createDefaultFrameConfig } from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import usePicturesStore, {
  type PictureItem
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { getPositionEntry } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'
import { placeSolo } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/helpers'
import { applySlotOffset } from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/slotOffset'
import useLayoutStore, { DEFAULT_SLOT_OFFSET } from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import useSizeStore, { resolveSlotSizeFromState } from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { layerAppliesTo } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'
import DeviceFrameShell from '@views/image-studio/canvas/PictureCanvas/DeviceFrameShell'
import PictureViewer from '@views/image-studio/canvas/PictureCanvas/PictureViewer'
import SlotFocusGizmos from '@views/image-studio/canvas/PictureCanvas/SlotFocusGizmos'
import usePictureSlot from '@views/image-studio/canvas/PictureCanvas/hooks/usePictureSlot'
import { useShadowLightDom } from '@views/image-studio/canvas/PictureCanvas/hooks/useShadowLightDom'
import useSlotAltDrag from '@views/image-studio/canvas/PictureCanvas/hooks/useSlotAltDrag'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { type CSSProperties, type FC, memo, useCallback, useMemo, useRef, useState } from 'react'

const SLOT_RASTER_MAX = 4

const slotRasterScale = (has3d: boolean, boardScale: number) => {
  if (!has3d) return 1
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const needed = dpr * Math.max(1, boardScale)
  if (needed <= 1.25) return 1
  if (needed <= 2.25) return 2
  if (needed <= 3.25) return 3
  return SLOT_RASTER_MAX
}

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
  baseX: number
  baseY: number
  slotWidth: number
  slotHeight: number
  rotateZ: number
  rotateX: number
  rotateY: number
  zIndex: number
  selected: boolean
  canvasWidth: number
  canvasHeight: number
}

const PictureSlot = memo(function PictureSlot({
  picture,
  left: slotLeft,
  top: slotTop,
  baseX,
  baseY,
  slotWidth,
  slotHeight,
  rotateZ,
  rotateX,
  rotateY,
  zIndex,
  selected,
  canvasWidth,
  canvasHeight
}: SlotProps) {
  const { isLoading, setIsLoading, handleLoadError, handleDropFile, handleSize, select, imageUrl } = usePictureSlot(picture.id)
  const altDrag = useSlotAltDrag({
    slotId: picture.id,
    canvasWidth,
    canvasHeight,
    baseX,
    baseY,
    slotWidth,
    slotHeight
  })

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
  const shadowLayers = getTabsStore(TABS_SCOPES.shadow)(s => s.layers)
  const shadowTabId = useMemo(() => resolveLayerIdForSlot(shadowLayers, picture.id), [shadowLayers, picture.id])
  const defaultFrame = useMemo(() => createDefaultFrameConfig(), [])
  const frameConfig = useFrameStore(s => (frameTabId ? s.byTab[frameTabId] : undefined) ?? defaultFrame)
  const resolvedFrameId = frameConfig.frameId
  const storedFrameAspect =
    typeof frameConfig.frameAspect === 'number' && frameConfig.frameAspect > 0
      ? frameConfig.frameAspect
      : picture.frameAspect && picture.frameAspect > 0
        ? picture.frameAspect
        : null

  const { data: framesData } = framesQuery.list()
  const catalogFrame = resolvedFrameId ? (framesData?.data?.frames.find(item => item.id === resolvedFrameId) ?? null) : null
  const frameAspect = storedFrameAspect ?? catalogFrame?.aspect ?? null
  const hasDeviceFrame = Boolean(resolvedFrameId)

  const frameBox = useMemo(() => {
    const slot = { left: 0, top: 0, width: slotWidth, height: slotHeight }
    if (!frameAspect || frameAspect <= 0) return slot
    return fitFrameInSlot(slot, frameAspect)
  }, [frameAspect, slotHeight, slotWidth])

  const { left, top, width: boxWidth, height: boxHeight } = frameBox
  const boardScale = useBoardStore(s => s.scale)
  const has3d = rotateX !== 0 || rotateY !== 0
  const rasterScale = slotRasterScale(has3d, boardScale)
  const qx = (value: number) => value * rasterScale
  const drawWidth = qx(boxWidth)
  const drawHeight = qx(boxHeight)
  const edgePx = Math.min(drawWidth, drawHeight)
  const perspectivePx = Math.round(Math.max(canvasWidth, canvasHeight) * 1.75 * rasterScale)
  const transform = has3d
    ? `${rasterScale !== 1 ? `scale(${1 / rasterScale}) ` : ''}perspective(${perspectivePx}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : `rotateZ(${rotateZ}deg)`

  const rootRef = useRef<HTMLDivElement>(null)
  const boxShadowRef = useRef<HTMLDivElement>(null)
  const lightsRef = useRef<HTMLDivElement>(null)
  const [filterTarget, setFilterTarget] = useState<HTMLImageElement | null>(null)
  const bindFilterTarget = useCallback((node: HTMLImageElement | null) => {
    setFilterTarget(node)
  }, [])

  const radiusCss = activeIndividualBorder
    ? `${qx(borderLTRadius)}px ${qx(borderRTRadius)}px ${qx(borderRBRadius)}px ${qx(borderLBRadius)}px`
    : `${qx(borderRadiusValue)}px`

  const cornerShapeCss = useMemo(() => resolveSmoothCornerStyle(borderSmooth).cornerShape, [borderSmooth])
  const showMat = !hasDeviceFrame && matEnabled && matTop + matRight + matBottom + matLeft > 0
  const strokeWidth = hasDeviceFrame || type === 'none' ? 0 : qx(size)
  const matInset = showMat ? qx(Math.min(matTop, matRight, matBottom, matLeft)) : 0

  const effectiveRadiusCss = hasDeviceFrame ? '0px' : radiusCss
  const effectiveBorderType = hasDeviceFrame ? 'none' : type
  const effectiveBorderSize = strokeWidth

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
      padding: showMat ? `${qx(matTop)}px ${qx(matRight)}px ${qx(matBottom)}px ${qx(matLeft)}px` : 0,
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
    qx,
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
      onClick={event => {
        if (event.altKey || event.shiftKey || event.ctrlKey || event.metaKey || altDrag.altDragging) return
        select()
      }}
      onClickCapture={altDrag.onClickCapture}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          select()
        }
      }}
      onPointerDown={altDrag.onPointerDown}
      onPointerMove={altDrag.onPointerMove}
      onPointerUp={altDrag.onPointerUp}
      onPointerCancel={altDrag.onPointerCancel}
      className={cn(
        'absolute overflow-visible outline-none select-none',
        !hasDeviceFrame && 'rounded-sm',
        altDrag.altDragging ? 'cursor-grabbing' : 'cursor-pointer'
      )}
      style={{
        left: slotLeft + left - (drawWidth - boxWidth) / 2,
        top: slotTop + top - (drawHeight - boxHeight) / 2,
        width: drawWidth,
        height: drawHeight,
        zIndex: altDrag.altDragging
          ? APP_Z_INDEX.slot.dragging
          : selected
            ? APP_Z_INDEX.slot.selected
            : zIndex,
        transform,
        transformOrigin: 'center center',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      title='Alt, Ctrl o Shift + arrastrar para mover'
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
              <div
                ref={lightsRef}
                className='pointer-events-none absolute inset-0'
                style={{ zIndex: APP_Z_INDEX.slot.light }}
              />
              <Dropzone onDrop={handleDropFile} maxFiles={1} overlay={Boolean(imageUrl)} compact={hasDeviceFrame} />
            </div>
          </div>
        </div>
      </DeviceFrameShell>
      {shadowTabId && <SlotFocusGizmos tabId={shadowTabId} hostRef={rootRef} />}
    </div>
  )
})

const PictureCanvas: FC = () => {
  const pictures = usePicturesStore(s => s.pictures)
  const selectedId = usePicturesStore(s => s.selectedId)
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const sizeLayers = useSizeStore(s => s.layers)
  const constrainToParent = useLayoutStore(s => s.constrainToParent)
  const positionId = useLayoutStore(s => s.positionId)
  const slotOffset = useLayoutStore(s => s.slotOffset)
  const advancedPose = useLayoutStore(s => s.advancedPose)

  const placements = useMemo(() => {
    const slotSizes = pictures.map(picture => resolveSlotSizeFromState(sizeLayers, picture.id))
    const ctx = {
      count: pictures.length,
      canvasWidth: backgroundWidth,
      canvasHeight: backgroundHeight,
      slotSizes,
      constrainToParent
    }
    const entry = getPositionEntry(pictures.length, positionId)
    let base = entry.builder(ctx)
    if (advancedPose) {
      const selectedIndex = pictures.findIndex(picture => picture.id === selectedId)
      const index = pictures.length === 1 ? 0 : Math.max(0, selectedIndex)
      const solo = placeSolo({ ...ctx, slotSizes: [slotSizes[index] ?? slotSizes[0]] }, advancedPose)[0]
      if (solo) {
        base = base.map((placement, i) => (i === index ? { ...solo, zIndex: placement.zIndex } : placement))
      }
    }
    const canvas = { width: backgroundWidth, height: backgroundHeight }
    return base.map((placement, index) => {
      const slotId = pictures[index]?.id
      const offset = slotId ? (slotOffset[slotId] ?? DEFAULT_SLOT_OFFSET) : DEFAULT_SLOT_OFFSET
      const visual = applySlotOffset(placement, offset, canvas)
      return { ...visual, baseX: placement.x, baseY: placement.y }
    })
  }, [
    advancedPose,
    backgroundHeight,
    backgroundWidth,
    constrainToParent,
    pictures,
    positionId,
    selectedId,
    sizeLayers,
    slotOffset
  ])

  return (
    <div
      className='pointer-events-none absolute inset-0 overflow-hidden select-none'
      id='picture-canvas-layer'
      style={{ zIndex: APP_Z_INDEX.canvas.slots, isolation: 'isolate' }}
    >
      <div className='pointer-events-auto relative size-full overflow-hidden'>
        {pictures.map((picture, index) => {
          const placement = placements[index]
          if (!placement) return null
          return (
            <PictureSlot
              key={picture.id}
              picture={picture}
              left={placement.x}
              top={placement.y}
              baseX={placement.baseX}
              baseY={placement.baseY}
              slotWidth={placement.width}
              slotHeight={placement.height}
              rotateZ={placement.rotateZ}
              rotateX={placement.rotateX}
              rotateY={placement.rotateY}
              zIndex={placement.zIndex}
              selected={picture.id === selectedId}
              canvasWidth={backgroundWidth}
              canvasHeight={backgroundHeight}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PictureCanvas
