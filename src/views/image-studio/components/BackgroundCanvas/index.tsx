'use client'

import { resolveBackgroundStyle } from '@views/image-studio/utils/backgroundStyle'
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
      ...resolveBackgroundStyle(background, { blendMode, positionX, positionY })
    }

    if (blur > 0) {
      style.filter = `blur(${blur}px)`
      style.transform = 'scale(1.06)'
    }

    return style
  }, [background, blendMode, blur, positionX, positionY])

  const overlayStyle = useMemo(
    (): CSSProperties => ({
      backgroundColor: overlayColor,
      opacity: overlayOpacity / 100
    }),
    [overlayColor, overlayOpacity]
  )

  return (
    <div className='editor-background relative overflow-hidden' style={frameStyle}>
      <div className='absolute inset-0' style={fillStyle} />
      {overlayOpacity > 0 && <div className='pointer-events-none absolute inset-0' style={overlayStyle} />}
    </div>
  )
}

export default BackgroundCanvas
