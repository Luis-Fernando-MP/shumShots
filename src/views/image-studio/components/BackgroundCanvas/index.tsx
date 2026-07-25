'use client'

import { type CSSProperties, type FC, useMemo } from 'react'

import useBackgroundStore from '../../store/background/background.store'
import useBackgroundRadiusStore from '../../store/background/backgroundRadius.store'

const BackgroundCanvas: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const background = useBackgroundStore(s => s.background)
  const blendMode = useBackgroundStore(s => s.blendMode)

  const activeIndividualBorder = useBackgroundRadiusStore(s => s.activeIndividualBorder)
  const borderRadius = useBackgroundRadiusStore(s => s.borderRadius)
  const borderLTRadius = useBackgroundRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useBackgroundRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useBackgroundRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useBackgroundRadiusStore(s => s.borderLBRadius)

  const style = useMemo((): CSSProperties => {
    const fill = background ?? 'rgb(var(--tn-primary))'
    const radius = activeIndividualBorder
      ? `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
      : `${borderRadius}px`

    const backgroundStyle: CSSProperties = fill.includes('gradient')
      ? {
          backgroundImage: fill,
          backgroundBlendMode: blendMode,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }
      : { backgroundColor: fill }

    return {
      width: backgroundWidth,
      height: backgroundHeight,
      borderRadius: radius,
      ...backgroundStyle
    }
  }, [
    activeIndividualBorder,
    background,
    backgroundHeight,
    backgroundWidth,
    blendMode,
    borderLBRadius,
    borderLTRadius,
    borderRBRadius,
    borderRTRadius,
    borderRadius
  ])

  return <div className='editor-background' style={style} />
}

export default BackgroundCanvas
