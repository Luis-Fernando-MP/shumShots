'use client'

import { framesQuery, type Frame } from '@common/core'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import useFrameStore from '@views/image-studio/Popups/FrameConfiguration/store'
import { CircleOffIcon } from 'lucide-react'
import { type FC } from 'react'

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
        'group border-border/70 bg-muted/30 hover:border-border hover:bg-muted/50 flex flex-col overflow-hidden rounded-radius border text-left transition-colors',
        active && 'border-primary ring-primary/50 bg-secondary/40 ring-1'
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
      <span className='text-muted-foreground group-hover:text-foreground truncate px-1.5 py-1.5 text-center text-[10px] leading-tight font-medium'>
        {frame.label}
      </span>
    </button>
  )
}

const DeviceFramePresets: FC = () => {
  const frameId = useFrameStore(s => s.frameId)
  const setFrameId = useFrameStore(s => s.setFrameId)
  const { data, isLoading, isError } = framesQuery.list()

  const groups = data?.data?.groups ?? []

  if (isLoading) {
    return <Typography.Small tone='secondary'>Cargando frames…</Typography.Small>
  }

  if (isError) {
    return <Typography.Small tone='secondary'>No se pudieron cargar los frames</Typography.Small>
  }

  return (
    <div className='gap-grid flex flex-col'>
      <button
        type='button'
        onClick={() => setFrameId(null)}
        aria-label='Sin frame'
        className={cn(
          'border-border/70 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex h-9 w-full items-center justify-center gap-2 rounded-radius border px-2 text-[11px] font-medium transition-colors',
          frameId === null && 'border-primary bg-secondary/40 text-foreground ring-primary/50 ring-1'
        )}
      >
        <CircleOffIcon className='size-3.5 shrink-0' />
        Sin frame
      </button>

      {groups.length === 0 && (
        <Typography.Small tone='secondary'>
          No hay frames en Cloudinary (<code className='text-foreground'>pixis/frames</code>).
        </Typography.Small>
      )}

      {groups.map(group => (
        <div key={group.id ?? '__root'} className='flex flex-col gap-1.5'>
          <Typography.Label size='xs' weight='semibold' className='text-muted-foreground tracking-wide'>
            {group.label}
          </Typography.Label>
          <div className='grid grid-cols-2 gap-2'>
            {group.frames.map(frame => (
              <FrameThumb
                key={frame.id}
                frame={frame}
                active={frameId === frame.id}
                onSelect={setFrameId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeviceFramePresets
