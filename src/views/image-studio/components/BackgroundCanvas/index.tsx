'use client'

import {
  buildFilterCss,
  resolveBackgroundStyle,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import { type CSSProperties, type FC, useMemo } from 'react'

const BackgroundCanvas: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const background = useBackgroundStore(s => s.background)
  const blendMode = useBackgroundStore(s => s.blendMode)
  const overlayColor = useBackgroundStore(s => s.overlayColor)
  const overlayOpacity = useBackgroundStore(s => s.overlayOpacity)
  const blur = useBackgroundStore(s => s.blur)
  const positionX = useBackgroundStore(s => s.positionX)
  const positionY = useBackgroundStore(s => s.positionY)
  const scale = useBackgroundStore(s => s.scale)
  const brightness = useBackgroundStore(s => s.brightness)
  const contrast = useBackgroundStore(s => s.contrast)
  const saturate = useBackgroundStore(s => s.saturate)
  const grayscale = useBackgroundStore(s => s.grayscale)
  const sepia = useBackgroundStore(s => s.sepia)
  const hue = useBackgroundStore(s => s.hue)
  const vignettePreset = useBackgroundStore(s => s.vignettePreset)
  const vignetteIntensity = useBackgroundStore(s => s.vignetteIntensity)
  const vignetteSize = useBackgroundStore(s => s.vignetteSize)
  const vignetteSoftness = useBackgroundStore(s => s.vignetteSoftness)
  const vignetteColor = useBackgroundStore(s => s.vignetteColor)
  const vignetteFocusX = useBackgroundStore(s => s.vignetteFocusX)
  const vignetteFocusY = useBackgroundStore(s => s.vignetteFocusY)

  const activeIndividualBorder = useBackgroundRadiusStore(s => s.activeIndividualBorder)
  const borderRadiusValue = useBackgroundRadiusStore(s => s.borderRadius)
  const borderLTRadius = useBackgroundRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useBackgroundRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useBackgroundRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useBackgroundRadiusStore(s => s.borderLBRadius)

  const frameStyle = useMemo((): CSSProperties => {
    let borderRadius = `${borderRadiusValue}px`
    if (activeIndividualBorder) {
      borderRadius = `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
    }

    return {
      width: backgroundWidth,
      height: backgroundHeight,
      borderRadius
    }
  }, [
    activeIndividualBorder,
    backgroundHeight,
    backgroundWidth,
    borderLBRadius,
    borderLTRadius,
    borderRBRadius,
    borderRTRadius,
    borderRadiusValue
  ])

  const fillStyle = useMemo((): CSSProperties => {
    const style: CSSProperties = {
      ...resolveBackgroundStyle(background, { blendMode, positionX, positionY, scale })
    }

    const filter = buildFilterCss({
      blur,
      brightness,
      contrast,
      saturate,
      grayscale,
      sepia,
      hue
    })

    if (filter) style.filter = filter

    // Continuous zoom from cover. Blur edge bleed scales with blur px (no sudden jump at 1%).
    const zoom = Math.max(1, scale / 100)
    const minDim = Math.max(1, Math.min(backgroundWidth, backgroundHeight))
    const blurPad = blur <= 0 ? 1 : 1 + (2 * blur) / minDim
    const combined = zoom * blurPad
    if (combined !== 1) {
      style.transform = `scale(${combined})`
      style.transformOrigin = `${positionX}% ${positionY}%`
    }

    return style
  }, [
    background,
    backgroundHeight,
    backgroundWidth,
    blendMode,
    blur,
    brightness,
    contrast,
    grayscale,
    hue,
    positionX,
    positionY,
    saturate,
    scale,
    sepia
  ])

  const overlayStyle = useMemo(
    (): CSSProperties => ({
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100
    }),
    [overlayColor, overlayOpacity]
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
    <div className='editor-background relative overflow-hidden' style={frameStyle}>
      <div className='absolute inset-0' style={fillStyle} />
      {overlayOpacity > 0 && <div className='pointer-events-none absolute inset-0' style={overlayStyle} />}
      {vignetteStyle && <div className='pointer-events-none absolute inset-0' style={vignetteStyle} />}
    </div>
  )
}

export default BackgroundCanvas
