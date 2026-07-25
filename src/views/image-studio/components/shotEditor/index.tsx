'use client'

import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import { type FC, memo } from 'react'

import BackgroundCanvas from '../BackgroundCanvas'
import PictureCanvas from '../PictureCanvas'

const ShotEditor: FC = () => {
  const activeIndividualBorder = useBackgroundRadiusStore(s => s.activeIndividualBorder)
  const borderRadiusValue = useBackgroundRadiusStore(s => s.borderRadius)
  const borderLTRadius = useBackgroundRadiusStore(s => s.borderLTRadius)
  const borderRTRadius = useBackgroundRadiusStore(s => s.borderRTRadius)
  const borderRBRadius = useBackgroundRadiusStore(s => s.borderRBRadius)
  const borderLBRadius = useBackgroundRadiusStore(s => s.borderLBRadius)

  let borderRadius = `${borderRadiusValue}px`
  if (activeIndividualBorder) {
    borderRadius = `${borderLTRadius}px ${borderRTRadius}px ${borderRBRadius}px ${borderLBRadius}px`
  }

  return (
    <div id='editor' className='relative size-fit overflow-hidden' style={{ borderRadius }}>
      <BackgroundCanvas />
      <PictureCanvas />
    </div>
  )
}

export default memo(ShotEditor)
