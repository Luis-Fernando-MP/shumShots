'use client'

import SliderControl from '@common/components/SliderControl'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import usePortraitStore, { type PortraitMode } from '@views/image-studio/Popups/Canvas/Portrait/store/portrait/store'
import { ApertureIcon, BanIcon, BlendIcon, SearchIcon, SunsetIcon } from 'lucide-react'
import { type FC } from 'react'

const MODES: { id: PortraitMode; label: string; Icon: typeof BanIcon }[] = [
  { id: 'none', label: 'Off', Icon: BanIcon },
  { id: 'lensBlur', label: 'Lens', Icon: ApertureIcon },
  { id: 'stage', label: 'Stage', Icon: SunsetIcon },
  { id: 'magnifier', label: 'Lupa', Icon: SearchIcon },
  { id: 'linearBlur', label: 'Linear', Icon: BlendIcon }
]

/**
 * Panel de retrato: foco, lupa, grain y blur de lienzo.
 */
const Portrait: FC = () => {
  const mode = usePortraitStore(s => s.mode)
  const size = usePortraitStore(s => s.size)
  const amount = usePortraitStore(s => s.amount)
  const softness = usePortraitStore(s => s.softness)
  const zoom = usePortraitStore(s => s.zoom)
  const noise = usePortraitStore(s => s.noise)
  const canvasBlur = usePortraitStore(s => s.canvasBlur)
  const setMode = usePortraitStore(s => s.setMode)
  const setSize = usePortraitStore(s => s.setSize)
  const setAmount = usePortraitStore(s => s.setAmount)
  const setSoftness = usePortraitStore(s => s.setSoftness)
  const setZoom = usePortraitStore(s => s.setZoom)
  const setNoise = usePortraitStore(s => s.setNoise)
  const setCanvasBlur = usePortraitStore(s => s.setCanvasBlur)
  const reset = usePortraitStore(s => s.reset)

  return (
    <DomainPanel onReset={reset} resetLabel='Resetear retrato'>
      <SectionBlock title='Modo'>
        <div className='grid grid-cols-5 gap-2'>
          {MODES.map(item => {
            const active = mode === item.id
            const Icon = item.Icon
            return (
              <button
                key={item.id}
                type='button'
                aria-pressed={active}
                onClick={() => setMode(item.id)}
                className={cn('flex flex-col items-center gap-1 px-1 py-2', chromeTile(active))}
              >
                <Icon className='size-4' />
                <Text.caption>{item.label}</Text.caption>
              </button>
            )
          })}
        </div>
      </SectionBlock>

      {mode !== 'none' && (
        <SectionBlock title='Ajustes'>
          <SliderControl
            label={mode === 'stage' ? 'Alcance' : 'Tamaño'}
            value={size}
            onChangeRange={setSize}
            min={8}
            max={80}
            step={1}
          />
          <SliderControl label='Intensidad' value={amount} onChangeRange={setAmount} min={0} max={100} step={1} />
          {mode === 'stage' && (
            <SliderControl
              label='Suavizado'
              value={softness}
              onChangeRange={setSoftness}
              min={5}
              max={90}
              step={1}
            />
          )}
          {mode === 'magnifier' && (
            <SliderControl
              label='Zoom'
              value={zoom}
              onChangeRange={setZoom}
              min={1.2}
              max={4}
              step={0.1}
              unit='x'
            />
          )}
        </SectionBlock>
      )}

      <SectionBlock title='Lienzo'>
        <SliderControl label='Noise' value={noise} onChangeRange={setNoise} min={0} max={100} step={1} />
        <SliderControl
          label='Blur'
          value={canvasBlur}
          onChangeRange={setCanvasBlur}
          min={0}
          max={24}
          step={1}
          unit='px'
        />
      </SectionBlock>
    </DomainPanel>
  )
}

export default Portrait
