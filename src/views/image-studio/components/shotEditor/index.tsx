'use client'

import BackgroundCanvas from '@views/image-studio/canvas/BackgroundCanvas'
import CanvasLightOverlay from '@views/image-studio/canvas/CanvasLightOverlay'
import PictureCanvas from '@views/image-studio/canvas/PictureCanvas'
import PortraitLayer from '@views/image-studio/canvas/PortraitLayer'
import TextOverlay from '@views/image-studio/canvas/TextOverlay'
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
      <PortraitLayer>
        <BackgroundCanvas parentRef={editorRef} />
        <PictureCanvas />
        <CanvasLightOverlay />
      </PortraitLayer>
      <TextOverlay />
    </div>
  )
}

export default memo(ShotEditor)
