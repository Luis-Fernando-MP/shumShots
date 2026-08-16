'use client'

import Button from '@common/components/Button'
import ColorPicker from '@common/components/ColorPicker'
import SliderControl from '@common/components/SliderControl'
import { Tab } from '@common/components/Tabs'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import useTextLayersStore, {
  type TextAlign,
  type TextLayer
} from '@views/image-studio/Popups/CanvasImages/TextLayers/store/text-layers/store'
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BookmarkIcon,
  CopyIcon,
  PaletteIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
  TypeIcon
} from 'lucide-react'
import { type FC } from 'react'

const FONTS = [
  { id: 'Impact, sans-serif', sample: 'Aa' },
  { id: 'Georgia, serif', sample: 'Aa' },
  { id: 'Plus Jakarta Sans, sans-serif', sample: 'Aa' },
  { id: 'Geist Sans, sans-serif', sample: 'Aa' }
]
const WEIGHTS = [400, 700, 900]
const ALIGNS: { id: TextAlign; Icon: typeof AlignLeftIcon }[] = [
  { id: 'left', Icon: AlignLeftIcon },
  { id: 'center', Icon: AlignCenterIcon },
  { id: 'right', Icon: AlignRightIcon }
]
const POSITIONS = [
  { x: 20, y: 18 },
  { x: 50, y: 18 },
  { x: 80, y: 18 },
  { x: 20, y: 50 },
  { x: 50, y: 50 },
  { x: 80, y: 50 },
  { x: 20, y: 82 },
  { x: 50, y: 82 },
  { x: 80, y: 82 }
]

const LayerRow: FC<{ layer: TextLayer; index: number; selected: boolean }> = ({ layer, index, selected }) => {
  const selectLayer = useTextLayersStore(s => s.selectLayer)
  const duplicateLayer = useTextLayersStore(s => s.duplicateLayer)
  const removeLayer = useTextLayersStore(s => s.removeLayer)

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-[12px] px-2 py-1.5',
        chromeTile(selected)
      )}
    >
      <button type='button' className='flex min-w-0 flex-1 items-center gap-2 text-left' onClick={() => selectLayer(layer.id)}>
        <span className='bg-primary text-primary-foreground grid size-6 place-content-center rounded-[8px] text-[11px] font-semibold'>
          {index + 1}
        </span>
        <Text.emphasis className='truncate'>{layer.content || 'Texto'}</Text.emphasis>
      </button>
      <Button size='icon' variant='ghost' className='size-7 rounded-[12px]' onClick={() => duplicateLayer(layer.id)}>
        <CopyIcon className='size-3.5' />
      </Button>
      <Button size='icon' variant='ghost' className='size-7 rounded-[12px]' onClick={() => removeLayer(layer.id)}>
        <Trash2Icon className='size-3.5' />
      </Button>
    </div>
  )
}

/**
 * Panel de capas de texto del image-studio.
 */
const TextLayers: FC = () => {
  const layers = useTextLayersStore(s => s.layers)
  const selectedId = useTextLayersStore(s => s.selectedId)
  const addLayer = useTextLayersStore(s => s.addLayer)
  const updateLayer = useTextLayersStore(s => s.updateLayer)
  const reset = useTextLayersStore(s => s.reset)
  const selected = layers.find(layer => layer.id === selectedId) ?? layers[0]
  const empty = layers.length === 0

  return (
    <DomainPanel onReset={reset} resetLabel='Resetear texto'>
      <div className='flex items-center justify-between'>
        <Text.heading>Capas</Text.heading>
        <Button size='icon' variant='soft' className='size-8 rounded-[12px]' onClick={addLayer} aria-label='Añadir texto'>
          <PlusIcon className='size-4' />
        </Button>
      </div>

      {empty && (
        <button
          type='button'
          onClick={addLayer}
          className='border-border/70 bg-muted/40 flex min-h-24 w-full flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed'
        >
          <PlusIcon className='text-muted-foreground size-5' />
          <Text.caption>Añadir</Text.caption>
        </button>
      )}

      {!empty && (
        <div className='flex flex-col gap-1.5'>
          {layers.map((layer, index) => (
            <LayerRow key={layer.id} layer={layer} index={index} selected={layer.id === selected?.id} />
          ))}
        </div>
      )}

      {selected && (
        <Tab defaultValue='basic'>
          <Tab.List>
            <Tab.Trigger value='basic'>
              <TypeIcon className='size-3.5' />
              Básico
            </Tab.Trigger>
            <Tab.Trigger value='style'>
              <PaletteIcon className='size-3.5' />
              Estilo
            </Tab.Trigger>
            <Tab.Trigger value='effects'>
              <SparklesIcon className='size-3.5' />
              Efectos
            </Tab.Trigger>
            <Tab.Trigger value='presets'>
              <BookmarkIcon className='size-3.5' />
              Presets
            </Tab.Trigger>
          </Tab.List>

          <Tab.Content value='basic' className='mt-3 flex flex-col gap-3'>
            <textarea
              value={selected.content}
              onChange={event => updateLayer(selected.id, { content: event.target.value })}
              className='bg-muted min-h-20 w-full resize-none rounded-[12px] px-3 py-2 text-sm outline-none'
            />
            <div className='grid grid-cols-4 gap-2'>
              {FONTS.map(font => (
                <button
                  key={font.id}
                  type='button'
                  onClick={() => updateLayer(selected.id, { fontFamily: font.id })}
                  aria-label={font.id}
                  className={cn('py-2 text-sm', chromeTile(selected.fontFamily === font.id))}
                  style={{ fontFamily: font.id }}
                >
                  {font.sample}
                </button>
              ))}
            </div>
            <div className='grid grid-cols-3 gap-2'>
              {WEIGHTS.map(weight => (
                <button
                  key={weight}
                  type='button'
                  onClick={() => updateLayer(selected.id, { weight })}
                  className={cn('py-1.5 text-xs', chromeTile(selected.weight === weight))}
                  style={{ fontWeight: weight }}
                >
                  {weight}
                </button>
              ))}
            </div>
            <div className='grid grid-cols-3 gap-2'>
              {ALIGNS.map(item => {
                const Icon = item.Icon
                return (
                  <button
                    key={item.id}
                    type='button'
                    aria-label={item.id}
                    onClick={() => updateLayer(selected.id, { align: item.id })}
                    className={cn('grid place-content-center py-1.5', chromeTile(selected.align === item.id))}
                  >
                    <Icon className='size-3.5' />
                  </button>
                )
              })}
            </div>
            <SliderControl
              label='Tamaño'
              value={selected.fontSize}
              onChangeRange={value => updateLayer(selected.id, { fontSize: value })}
              min={12}
              max={160}
              step={1}
              displayValue={`${selected.fontSize}`}
            />
          </Tab.Content>

          <Tab.Content value='style' className='mt-3 flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <ColorPicker
                variant='swatch'
                value={selected.color}
                onChange={color => updateLayer(selected.id, { color })}
                format='hex'
                disableAlpha
                label='Color'
              />
              <SliderControl
                label='Opacidad'
                value={selected.opacity}
                onChangeRange={value => updateLayer(selected.id, { opacity: value })}
                min={10}
                max={100}
                step={1}
              />
            </div>
            <SliderControl
              label='Espaciado'
              value={selected.tracking}
              onChangeRange={value => updateLayer(selected.id, { tracking: value })}
              min={-8}
              max={24}
              step={1}
              displayValue={`${selected.tracking}`}
            />
          </Tab.Content>

          <Tab.Content value='effects' className='mt-3 flex flex-col gap-3'>
            <SliderControl
              label='X'
              value={selected.x}
              onChangeRange={value => updateLayer(selected.id, { x: value })}
              min={4}
              max={96}
              step={1}
              displayValue={`${Math.round(selected.x)}`}
            />
            <SliderControl
              label='Y'
              value={selected.y}
              onChangeRange={value => updateLayer(selected.id, { y: value })}
              min={4}
              max={96}
              step={1}
              displayValue={`${Math.round(selected.y)}`}
            />
            <SliderControl
              label='Rotación'
              value={selected.rotation}
              onChangeRange={value => updateLayer(selected.id, { rotation: value })}
              min={-30}
              max={30}
              step={1}
              displayValue={`${selected.rotation}°`}
            />
            <SliderControl
              label='Trazo'
              value={selected.strokeWidth}
              onChangeRange={value =>
                updateLayer(selected.id, {
                  strokeWidth: value,
                  stroke: value === 0 ? 'transparent' : selected.stroke === 'transparent' ? '#111111' : selected.stroke
                })
              }
              min={0}
              max={12}
              step={1}
              displayValue={`${selected.strokeWidth}px`}
            />
            <SliderControl
              label='Sombra'
              value={selected.shadowBlur}
              onChangeRange={value => updateLayer(selected.id, { shadowBlur: value })}
              min={0}
              max={40}
              step={1}
              displayValue={`${selected.shadowBlur}px`}
            />
          </Tab.Content>

          <Tab.Content value='presets' className='mt-3'>
            <div className='grid grid-cols-3 gap-2'>
              {POSITIONS.map(item => (
                <button
                  key={`${item.x}-${item.y}`}
                  type='button'
                  aria-label={`Posición ${item.x} ${item.y}`}
                  onClick={() => updateLayer(selected.id, { x: item.x, y: item.y })}
                  className={cn(
                    'relative flex aspect-[4/3] items-center justify-center overflow-hidden',
                    chromeTile(Math.abs(selected.x - item.x) < 1 && Math.abs(selected.y - item.y) < 1)
                  )}
                >
                  <span
                    className='bg-foreground/80 text-background absolute rounded-full px-1.5 py-0.5 text-[9px] font-semibold'
                    style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    Abc
                  </span>
                </button>
              ))}
            </div>
          </Tab.Content>
        </Tab>
      )}
    </DomainPanel>
  )
}

export default TextLayers
