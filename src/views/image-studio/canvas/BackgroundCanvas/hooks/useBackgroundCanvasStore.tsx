'use client'

import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore, {
  resolveSmoothCornerStyle
} from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import {
  buildBackgroundTransform,
  buildFilterCss,
  resolveBackgroundStyle,
  resolveDuotoneLayers,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { type CSSProperties, type RefObject, useLayoutEffect, useMemo } from 'react'

export type UseBackgroundCanvasStoreOptions = {
  parentRef?: RefObject<HTMLElement | null>
}

const useBackgroundCanvasStore = (options: UseBackgroundCanvasStoreOptions = {}) => {
  const { parentRef } = options

  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const background = useBackgroundStore(s => s.background)
  const blendMode = useBackgroundStore(s => s.blendMode)
  const overlayColor = useBackgroundStore(s => s.overlayColor)
  const overlayOpacity = useBackgroundStore(s => s.overlayOpacity)
  const blur = useBackgroundStore(s => s.blur)
  const rotation = useBackgroundStore(s => s.rotation)
  const positionX = useBackgroundStore(s => s.positionX)
  const positionY = useBackgroundStore(s => s.positionY)
  const scale = useBackgroundStore(s => s.scale)
  const brightness = useBackgroundStore(s => s.brightness)
  const contrast = useBackgroundStore(s => s.contrast)
  const saturate = useBackgroundStore(s => s.saturate)
  const grayscale = useBackgroundStore(s => s.grayscale)
  const sepia = useBackgroundStore(s => s.sepia)
  const hue = useBackgroundStore(s => s.hue)
  const duotoneIntensity = useBackgroundStore(s => s.duotoneIntensity)
  const duotoneShadow = useBackgroundStore(s => s.duotoneShadow)
  const duotoneHighlight = useBackgroundStore(s => s.duotoneHighlight)
  const vignettePreset = useBackgroundStore(s => s.vignettePreset)
  const vignetteIntensity = useBackgroundStore(s => s.vignetteIntensity)
  const vignetteSize = useBackgroundStore(s => s.vignetteSize)
  const vignetteSoftness = useBackgroundStore(s => s.vignetteSoftness)
  const vignetteColor = useBackgroundStore(s => s.vignetteColor)
  const vignetteFocusX = useBackgroundStore(s => s.vignetteFocusX)
  const vignetteFocusY = useBackgroundStore(s => s.vignetteFocusY)

  const activeIndividualBorder = useCanvasRadiusStore(s => s.activeIndividualBorder)
  const borderRadius = useCanvasRadiusStore(s => s.borderRadius)
  const borderLTRadius = useCanvasRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useCanvasRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useCanvasRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useCanvasRadiusStore(s => s.borderLBRadius)
  const borderSmooth = useCanvasRadiusStore(s => s.borderSmooth)

  const borderColor = useCanvasBorderStore(s => s.color)
  const borderSize = useCanvasBorderStore(s => s.size)
  const borderType = useCanvasBorderStore(s => s.type)
  const borderFinish = useCanvasBorderStore(s => s.finish)
  const borderGradient = useCanvasBorderStore(s => s.gradient)
  const borderBlendMode = useCanvasBorderStore(s => s.blendMode)
  const matColor = useCanvasBorderStore(s => s.matColor)
  const matEnabled = useCanvasBorderStore(s => s.matEnabled)
  const matTop = useCanvasBorderStore(s => s.matTop)
  const matRight = useCanvasBorderStore(s => s.matRight)
  const matBottom = useCanvasBorderStore(s => s.matBottom)
  const matLeft = useCanvasBorderStore(s => s.matLeft)

  const duotoneActive = duotoneIntensity > 0

  const radiusCss = activeIndividualBorder
    ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    : `${borderRadius}px`

  useLayoutEffect(() => {
    const el = parentRef?.current
    if (!el) return
    el.style.borderRadius = radiusCss
  }, [parentRef, radiusCss])

  const cornerShapeCss = useMemo(() => resolveSmoothCornerStyle(borderSmooth).cornerShape, [borderSmooth])

  const frameStyle = useMemo(() => {
    const style = buildCanvasFrameStyle({
      width: backgroundWidth,
      height: backgroundHeight,
      borderRadius: radiusCss,
      color: borderColor,
      size: borderSize,
      type: borderType,
      finish: borderFinish,
      gradient: borderGradient,
      blendMode: borderBlendMode
    })
    if (cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [
    backgroundHeight,
    backgroundWidth,
    borderBlendMode,
    borderColor,
    borderFinish,
    borderGradient,
    borderSize,
    borderType,
    cornerShapeCss,
    radiusCss
  ])

  const contentRadiusCss = useMemo(() => {
    const matInset = matEnabled ? Math.min(matTop, matRight, matBottom, matLeft) : 0
    return insetBorderRadius(radiusCss, (borderType === 'none' ? 0 : borderSize) + matInset)
  }, [borderSize, borderType, matBottom, matEnabled, matLeft, matRight, matTop, radiusCss])

  const matRadiusCss = useMemo(
    () => insetBorderRadius(radiusCss, borderType === 'none' ? 0 : borderSize),
    [borderSize, borderType, radiusCss]
  )

  const showMat = matEnabled && matTop + matRight + matBottom + matLeft > 0

  const matStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      boxSizing: 'border-box',
      borderRadius: matRadiusCss,
      padding: showMat ? `${matTop}px ${matRight}px ${matBottom}px ${matLeft}px` : 0,
      backgroundColor: showMat ? matColor : 'transparent'
    }
    if (cornerShapeCss) Object.assign(style, { cornerShape: cornerShapeCss })
    return style
  }, [cornerShapeCss, matBottom, matColor, matLeft, matRadiusCss, matRight, matTop, showMat])

  const fillStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      ...resolveBackgroundStyle(background, { blendMode, positionX, positionY, scale })
    }
    const filter = buildFilterCss({
      blur,
      brightness,
      contrast,
      saturate: duotoneActive ? 100 : saturate,
      grayscale: duotoneActive ? 100 : grayscale,
      sepia: duotoneActive ? 0 : sepia,
      hue: duotoneActive ? 0 : hue
    })
    if (filter) style.filter = filter
    Object.assign(
      style,
      buildBackgroundTransform({
        scale,
        blur,
        rotation,
        width: backgroundWidth,
        height: backgroundHeight,
        originX: positionX,
        originY: positionY
      })
    )
    return style
  }, [
    background,
    backgroundHeight,
    backgroundWidth,
    blendMode,
    blur,
    brightness,
    contrast,
    duotoneActive,
    grayscale,
    hue,
    positionX,
    positionY,
    rotation,
    saturate,
    scale,
    sepia
  ])

  const overlayStyle = useMemo(
    (): CSSProperties => ({ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }),
    [overlayColor, overlayOpacity]
  )

  const duotoneLayers = useMemo(
    () => (duotoneActive ? resolveDuotoneLayers(duotoneShadow, duotoneHighlight, duotoneIntensity) : null),
    [duotoneActive, duotoneHighlight, duotoneIntensity, duotoneShadow]
  )

  const vignetteStyle = useMemo(
    () =>
      resolveVignetteStyle({
        preset: vignettePreset,
        intensity: vignetteIntensity,
        size: vignetteSize,
        softness: vignetteSoftness,
        color: vignetteColor,
        focusX: vignetteFocusX,
        focusY: vignetteFocusY
      }),
    [
      vignetteColor,
      vignetteFocusX,
      vignetteFocusY,
      vignetteIntensity,
      vignettePreset,
      vignetteSize,
      vignetteSoftness
    ]
  )

  return {
    radiusCss,
    cornerShapeCss,
    contentRadiusCss,
    frameStyle,
    matStyle,
    fillStyle,
    overlayStyle,
    overlayOpacity,
    duotoneLayers,
    vignetteStyle
  }
}

export default useBackgroundCanvasStore
