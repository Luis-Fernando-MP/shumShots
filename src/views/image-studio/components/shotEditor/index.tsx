'use client'

import { type FC, memo } from 'react'

import useBackgroundRadiusStore from '../../store/background/backgroundRadius.store'
import BackgroundCanvas from '../BackgroundCanvas'
import PictureCanvas from '../PictureCanvas'

const ShotEditor: FC = () => {
  const borderRadius = useBackgroundRadiusStore(s =>
    s.activeIndividualBorder
      ? `${s.borderLTRadius}px ${s.borderRTRadius}px ${s.borderRBRadius}px ${s.borderLBRadius}px`
      : `${s.borderRadius}px`
  )

  return (
    <div id='editor' className='relative size-fit overflow-hidden' style={{ borderRadius }}>
      <BackgroundCanvas />
      <PictureCanvas />
    </div>
  )
}

export default memo(ShotEditor)
