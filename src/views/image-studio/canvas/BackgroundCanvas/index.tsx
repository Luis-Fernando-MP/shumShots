'use client'

import { type FC, type RefObject } from 'react'

import useBackgroundCanvasStore from './hooks/useBackgroundCanvasStore'

type Props = {
  parentRef?: RefObject<HTMLElement | null>
}

const BackgroundCanvas: FC<Props> = ({ parentRef }) => {
  const {
    cornerShapeCss,
    contentRadiusCss,
    frameStyle,
    matStyle,
    fillStyle,
    overlayStyle,
    overlayOpacity,
    duotoneLayers,
    vignetteStyle,
    lightOverlays
  } = useBackgroundCanvasStore({ parentRef })

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
          {lightOverlays.map((style, index) => (
            <div key={index} className='pointer-events-none absolute inset-0' style={style} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BackgroundCanvas
