'use client'

import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import useBackgroundRadiusStore, {
  resolveSmoothCornerStyle
} from '@views/image-studio/store/background/backgroundRadius.store'
import {
  buildBackgroundTransform,
  buildFilterCss,
  resolveBackgroundStyle,
  resolveDuotoneLayers,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import { buildCanvasFrameStyle, insetBorderRadius } from '@views/image-studio/utils/borderFrame'
import { type CSSProperties, type FC, useMemo } from 'react'

const BackgroundCanvas: FC = () => {
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

  const activeIndividualBorder = useBackgroundRadiusStore(s => s.activeIndividualBorder)
  const borderRadius = useBackgroundRadiusStore(s => s.borderRadius)
  const borderLTRadius = useBackgroundRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useBackgroundRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useBackgroundRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useBackgroundRadiusStore(s => s.borderLBRadius)

  const borderColor = useBackgroundBorderStore(s => s.color)
  const borderSize = useBackgroundBorderStore(s => s.size)
  const borderType = useBackgroundBorderStore(s => s.type)
  const borderFinish = useBackgroundBorderStore(s => s.finish)
  const borderGradient = useBackgroundBorderStore(s => s.gradient)
  const borderBlendMode = useBackgroundBorderStore(s => s.blendMode)
  const matColor = useBackgroundBorderStore(s => s.matColor)
  const matEnabled = useBackgroundBorderStore(s => s.matEnabled)
  const matTop = useBackgroundBorderStore(s => s.matTop)
  const matRight = useBackgroundBorderStore(s => s.matRight)
  const matBottom = useBackgroundBorderStore(s => s.matBottom)
  const matLeft = useBackgroundBorderStore(s => s.matLeft)
  const borderSmooth = useBackgroundRadiusStore(s => s.borderSmooth)

  const duotoneActive = duotoneIntensity > 0

  const radiusCss = activeIndividualBorder
    ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    : `${borderRadius}px`

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

  return (
    <div className='editor-background relative' style={frameStyle}>
      <div className='relative size-full' style={matStyle}>
        <div
          className='relative size-full overflow-hidden'
          style={{
            borderRadius: contentRadiusCss,
            ...(cornerShapeCss ? { cornerShape: cornerShapeCss } : {})
          }}
        >
          <div className='absolute inset-0' style={fillStyle} />
          {duotoneLayers && (
            <>
              <div className='pointer-events-none absolute inset-0' style={duotoneLayers.shadow} />
              <div className='pointer-events-none absolute inset-0' style={duotoneLayers.highlight} />
            </>
          )}
          {overlayOpacity > 0 && <div className='pointer-events-none absolute inset-0' style={overlayStyle} />}
          {vignetteStyle && <div className='pointer-events-none absolute inset-0' style={vignetteStyle} />}
        </div>
      </div>
    </div>
  )
}

export default BackgroundCanvas
