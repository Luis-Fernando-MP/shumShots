'use client'

import { framesQuery } from '@common/core'
import {
  useChromaFrame,
  type ChromaContentRect
} from '@views/image-studio/hooks/useChromaFrame'
import { type CSSProperties, type FC, type ReactNode, type Ref, memo } from 'react'

type Props = {
  frameId: string | null
  className?: string
  style?: CSSProperties
  filterTargetRef?: Ref<HTMLImageElement | null>
  children: ReactNode
}

const contentBoxStyle = (rect: ChromaContentRect): CSSProperties => ({
  position: 'absolute',
  left: `${rect.left * 100}%`,
  top: `${rect.top * 100}%`,
  width: `${rect.width * 100}%`,
  height: `${rect.height * 100}%`,
  overflow: 'hidden'
})

const fullMaskStyle = (maskUrl: string): CSSProperties => ({
  maskImage: `url(${maskUrl})`,
  WebkitMaskImage: `url(${maskUrl})`,
  maskMode: 'alpha',
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskPosition: '0 0',
  WebkitMaskPosition: '0 0',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat'
})

const DeviceFrameShell: FC<Props> = ({ frameId, className, style, filterTargetRef, children }) => {
  const { data } = framesQuery.list()
  const frame = frameId ? (data?.data?.frames.find(item => item.id === frameId) ?? null) : null
  const chroma = useChromaFrame(frame?.path)

  if (!frame) {
    return (
      <div className={className} style={{ width: '100%', height: '100%', overflow: 'visible', ...style }}>
        {children}
      </div>
    )
  }

  const contentRect = chroma?.contentRect ?? { left: 0, top: 0, width: 1, height: 1 }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        ...style
      }}
    >
      {chroma?.silhouetteUrl && (
        <img
          ref={filterTargetRef}
          src={chroma.silhouetteUrl}
          alt=''
          draggable={false}
          className='pointer-events-none absolute inset-0 z-0 size-full object-fill select-none'
        />
      )}

      {/*
        Mask stays in full-frame space (100% / 0 0). Remapping the mask onto the
        content box was shifting the screen and leaving black margins.
        The photo is laid out only inside contentRect (zona verde).
      */}
      <div
        className='absolute inset-0 z-[1]'
        style={chroma ? fullMaskStyle(chroma.maskUrl) : { visibility: 'hidden' }}
      >
        <div style={contentBoxStyle(contentRect)}>{children}</div>
      </div>

      <img
        src={chroma?.frameUrl ?? frame.path}
        alt=''
        draggable={false}
        className='pointer-events-none absolute inset-0 z-10 size-full object-fill select-none'
      />
    </div>
  )
}

export default memo(DeviceFrameShell)
