'use client'

import BackgroundCanvas from '@views/image-studio/canvas/BackgroundCanvas'
import CanvasLightOverlay from '@views/image-studio/canvas/CanvasLightOverlay'
import PictureCanvas from '@views/image-studio/canvas/PictureCanvas'
import { type FC, memo, useRef } from 'react'

const ShotEditor: FC = () => {
  const editorRef = useRef<HTMLDivElement>(null)

  return (
    <div
      id='editor'
      ref={editorRef}
      className='relative size-fit h-fit w-fit overflow-hidden'
      style={{ isolation: 'isolate' }}
    >
      <BackgroundCanvas parentRef={editorRef} />
      <PictureCanvas />
      <CanvasLightOverlay />
    </div>
  )
}

export default memo(ShotEditor)
