'use client'

import { framesQuery } from '@common/core'
import { useChromaFrame } from '@views/image-studio/hooks/useChromaFrame'
import type { CSSProperties, FC, ReactNode } from 'react'

type Props = {
  frameId: string | null
  className?: string
  style?: CSSProperties
  children: ReactNode
}

const maskStyle = (maskUrl: string): CSSProperties => ({
  maskImage: `url(${maskUrl})`,
  WebkitMaskImage: `url(${maskUrl})`,
  maskMode: 'alpha',
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  transform: 'scale(1.01)',
  transformOrigin: 'center'
})

const DeviceFrameShell: FC<Props> = ({ frameId, className, style, children }) => {
  const { data } = framesQuery.list()
  const frame = frameId ? (data?.data?.frames.find(item => item.id === frameId) ?? null) : null
  const chroma = useChromaFrame(frame?.path)

  if (!frame) {
    return (
      <div className={className} style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        className='absolute inset-0 overflow-hidden'
        style={chroma ? maskStyle(chroma.maskUrl) : { visibility: 'hidden' }}
      >
        {children}
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

export default DeviceFrameShell
