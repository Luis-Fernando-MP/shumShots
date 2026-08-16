'use client'

import { framesQuery, type Frame } from '@common/core'
import Text from '@common/components/Text'
import { chromeFrame, chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import useFrameStore, {
  createDefaultFrameConfig
} from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import { CircleOffIcon } from 'lucide-react'
import { type FC, useEffect } from 'react'

const FrameThumb: FC<{
  frame: Frame
  active: boolean
  onSelect: (id: string) => void
}> = ({ frame, active, onSelect }) => {
  const aspect = frame.aspect && frame.aspect > 0 ? frame.aspect : 0.5
  const isLandscape = aspect >= 1

  return (
    <button
      type='button'
      onClick={() => onSelect(frame.id)}
      aria-label={`Frame ${frame.label}`}
      title={frame.label}
      className={cn(
        'group flex flex-col overflow-hidden text-left',
        chromeFrame(active)
      )}
    >
      <div className={cn('relative w-full overflow-hidden', isLandscape ? 'h-14' : 'h-28')}>
        <img
          src={frame.previewPath || frame.path}
          alt=''
          loading='lazy'
          decoding='async'
          className='absolute inset-0 size-full object-contain p-2'
        />
      </div>
      <Text.caption className='truncate px-1.5 py-1.5 text-center'>{frame.label}</Text.caption>
    </button>
  )
}

type Props = { tabId: string }

const DeviceFramePresets: FC<Props> = ({ tabId }) => {
  const frameId = useFrameStore(
    s => s.byTab[tabId]?.frameId ?? createDefaultFrameConfig().frameId
  )
  const frameAspect = useFrameStore(s => s.byTab[tabId]?.frameAspect ?? null)
  const setFrameId = useFrameStore(s => s.setFrameId)
  const { data, isLoading, isError } = framesQuery.list()

  // Backfill aspect for frames picked before frameAspect was persisted.
  useEffect(() => {
    if (!frameId || frameAspect || !data?.data?.frames) return
    const frame = data.data.frames.find(item => item.id === frameId)
    if (frame?.aspect && frame.aspect > 0) setFrameId(tabId, frameId, frame.aspect)
  }, [data, frameAspect, frameId, setFrameId, tabId])

  const groups = data?.data?.groups ?? []

  if (isLoading) {
    return <Text.caption>Cargando frames…</Text.caption>
  }

  if (isError) {
    return <Text.caption>No se pudieron cargar los frames</Text.caption>
  }

  return (
    <div className='gap-grid flex flex-col'>
      <button
        type='button'
        onClick={() => setFrameId(tabId, null, null)}
        aria-label='Sin frame'
        className={cn(
          'text-muted-foreground flex h-9 w-full items-center justify-center gap-2 px-2 text-[11px] font-medium',
          chromeTile(frameId === null)
        )}
      >
        <CircleOffIcon className='size-3.5 shrink-0' />
        Sin frame
      </button>

      {groups.length === 0 && (
        <Text.caption>
          No hay marcos disponibles.
        </Text.caption>
      )}

      {groups.map(group => (
        <div key={group.id ?? '__root'} className='flex flex-col gap-3'>
          <Text.heading>{group.label}</Text.heading>
          <div className='grid grid-cols-2 gap-2'>
            {group.frames.map(frame => (
              <FrameThumb
                key={frame.id}
                frame={frame}
                active={frameId === frame.id}
                onSelect={id => setFrameId(tabId, id, frame.aspect)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeviceFramePresets
