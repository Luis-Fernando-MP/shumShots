'use client'

import APP_Z_INDEX from '@common/constants/z-index'
import { type CSSProperties, type FC, type RefObject } from 'react'

import useBackgroundCanvasStore from './hooks/useBackgroundCanvasStore'

type Props = {
  parentRef?: RefObject<HTMLElement | null>
}

const transparentBorder = (border: CSSProperties['border']): CSSProperties['border'] => {
  if (typeof border !== 'string' || border === 'none') return 'none'
  return border.replace(/solid\s+.+/, 'solid transparent')
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
    vignetteStyle
  } = useBackgroundCanvasStore({ parentRef })

  const contentClipStyle = {
    borderRadius: contentRadiusCss,
    ...(cornerShapeCss ? { cornerShape: cornerShapeCss } : {})
  } as CSSProperties

  const vignetteFrameStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    borderRadius: frameStyle.borderRadius,
    border: transparentBorder(frameStyle.border)
  }

  return (
    <>
      <div className='editor-background relative' style={{ ...frameStyle, zIndex: APP_Z_INDEX.canvas.background }}>
        <div className='relative size-full' style={matStyle}>
          <div className='relative size-full overflow-hidden' style={contentClipStyle}>
            <div className='absolute inset-0' style={{ ...fillStyle, zIndex: APP_Z_INDEX.canvas.fill }} />
            {duotoneLayers && (
              <>
                <div
                  className='pointer-events-none absolute inset-0'
                  style={{ ...duotoneLayers.shadow, zIndex: APP_Z_INDEX.canvas.duotone }}
                />
                <div
                  className='pointer-events-none absolute inset-0'
                  style={{ ...duotoneLayers.highlight, zIndex: APP_Z_INDEX.canvas.duotone }}
                />
              </>
            )}
            {overlayOpacity > 0 && (
              <div
                className='pointer-events-none absolute inset-0'
                style={{ ...overlayStyle, zIndex: APP_Z_INDEX.canvas.overlay }}
              />
            )}
          </div>
        </div>
      </div>
      {vignetteStyle && (
        <div
          className='pointer-events-none absolute inset-0'
          style={{ zIndex: APP_Z_INDEX.canvas.vignette }}
        >
          <div style={vignetteFrameStyle}>
            <div className='size-full' style={matStyle}>
              <div className='relative size-full overflow-hidden' style={contentClipStyle}>
                <div className='absolute inset-0' style={vignetteStyle} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BackgroundCanvas
