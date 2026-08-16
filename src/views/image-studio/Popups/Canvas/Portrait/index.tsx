'use client'

import SliderControl from '@common/components/SliderControl'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import usePortraitStore, { type PortraitMode } from '@views/image-studio/Popups/Canvas/Portrait/store/portrait/store'
import { ApertureIcon, BanIcon, BlendIcon, SearchIcon, SunsetIcon } from 'lucide-react'
import { type FC } from 'react'

/**
 * Panel de retrato: foco, lupa, grain y blur de lienzo.
 */

const MODES: { id: PortraitMode; label: string; Icon: typeof BanIcon }[] = [
  { id: 'none', label: 'Off', Icon: BanIcon },
  { id: 'lensBlur', label: 'Lens', Icon: ApertureIcon },
  { id: 'stage', label: 'Stage', Icon: SunsetIcon },
  { id: 'magnifier', label: 'Lupa', Icon: SearchIcon },
  { id: 'linearBlur', label: 'Linear', Icon: BlendIcon }
]

const Portrait: FC = () => {
  const mode = usePortraitStore(s => s.mode)
  const size = usePortraitStore(s => s.size)
  const amount = usePortraitStore(s => s.amount)
  const zoom = usePortraitStore(s => s.zoom)
  const noise = usePortraitStore(s => s.noise)
  const canvasBlur = usePortraitStore(s => s.canvasBlur)
  const setMode = usePortraitStore(s => s.setMode)
  const setSize = usePortraitStore(s => s.setSize)
  const setAmount = usePortraitStore(s => s.setAmount)
  const setZoom = usePortraitStore(s => s.setZoom)
  const setNoise = usePortraitStore(s => s.setNoise)
  const setCanvasBlur = usePortraitStore(s => s.setCanvasBlur)
  const reset = usePortraitStore(s => s.reset)

  return (
    <DomainPanel onReset={reset} resetLabel='Resetear retrato'>
      <div className='grid grid-cols-5 gap-1.5'>
        {MODES.map(item => {
          const active = mode === item.id
          const Icon = item.Icon
          return (
            <button
              key={item.id}
              type='button'
              aria-pressed={active}
              onClick={() => setMode(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-[12px] px-1 py-2',
                active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              )}
            >
              <Icon className='size-4' />
              <Text.caption className={cn(active && 'text-primary')}>{item.label}</Text.caption>
            </button>
          )
        })}
      </div>

      {mode !== 'none' && (
        <div className='flex flex-col gap-2'>
          <SliderControl label='Tamaño' value={size} onChangeRange={setSize} min={8} max={80} step={1} />
          {mode === 'stage' && (
            <SliderControl label='Oscuridad' value={amount} onChangeRange={setAmount} min={0} max={100} step={1} />
          )}
          {mode !== 'stage' && (
            <SliderControl label='Intensidad' value={amount} onChangeRange={setAmount} min={0} max={100} step={1} />
          )}
          {mode === 'magnifier' && (
            <SliderControl
              label='Zoom'
              value={zoom}
              onChangeRange={setZoom}
              min={1.2}
              max={4}
              step={0.1}
              displayValue={`${zoom.toFixed(1)}x`}
            />
          )}
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <Text.heading>Lienzo</Text.heading>
        <SliderControl label='Noise' value={noise} onChangeRange={setNoise} min={0} max={100} step={1} />
        <SliderControl
          label='Blur'
          value={canvasBlur}
          onChangeRange={setCanvasBlur}
          min={0}
          max={24}
          step={1}
          displayValue={`${canvasBlur}px`}
        />
      </div>
    </DomainPanel>
  )
}

export default Portrait
