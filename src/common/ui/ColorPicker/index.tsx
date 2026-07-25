'use client'

import Input from '@common/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@common/ui/Popover'
import { cn } from '@common/utils/cn'
import {
  type HsvaColor,
  getContrastingColor,
  hexToHsva,
  hsvaToHex,
  hsvaToRgbaString,
  rgbStringToHsva,
  rgbaStringToHsva,
  validHex
} from '@uiw/color-convert'
import Colorful from '@uiw/react-color-colorful'
import { PipetteIcon } from 'lucide-react'
import { type FC, type MouseEvent, type PointerEvent, useEffect, useState } from 'react'

const DEFAULT_HSVA: HsvaColor = { h: 217, s: 91, v: 91, a: 1 }

const isCssColorValue = (value: string) => {
  const v = value.trim().toLowerCase()
  if (!v) return false
  if (v.includes('gradient')) return false
  if (v.startsWith('url(')) return false
  if (v.startsWith('blob:')) return false
  if (v.startsWith('data:')) return false
  if (v.startsWith('http://') || v.startsWith('https://')) return false
  if (v.startsWith('/')) return false
  if (v.startsWith('#')) return validHex(v)
  if (v.startsWith('rgb')) return true
  if (v.startsWith('hsl')) return true
  return false
}

const normalizeAlpha = (a: number) => {
  if (a > 1) return Math.min(1, a / 255)
  if (a < 0) return 0
  return a
}

export const parseColorToHsva = (value?: string | null): HsvaColor => {
  if (!value || !isCssColorValue(value)) return { ...DEFAULT_HSVA }

  try {
    const trimmed = value.trim()
    if (trimmed.startsWith('#')) return hexToHsva(trimmed)

    if (trimmed.toLowerCase().startsWith('rgba')) {
      const hsva = rgbaStringToHsva(trimmed)
      return { ...hsva, a: normalizeAlpha(hsva.a) }
    }

    if (trimmed.toLowerCase().startsWith('rgb')) {
      return rgbStringToHsva(trimmed)
    }

    return { ...DEFAULT_HSVA }
  } catch {
    return { ...DEFAULT_HSVA }
  }
}

export type ColorPickerProps = {
  value?: string | null
  onChange: (color: string) => void
  className?: string
  label?: string
  format?: 'rgba' | 'hex'
  disableAlpha?: boolean
  variant?: 'default' | 'swatch'
}

const stopDragLeak = (event: PointerEvent | MouseEvent) => {
  event.stopPropagation()
}

const ColorPicker: FC<ColorPickerProps> = ({
  value,
  onChange,
  className,
  label = 'Color personalizado',
  format = 'rgba',
  disableAlpha = false,
  variant = 'default'
}) => {
  const [open, setOpen] = useState(false)
  const [hsva, setHsva] = useState<HsvaColor>(() => parseColorToHsva(value))
  const [hexDraft, setHexDraft] = useState(() => hsvaToHex(parseColorToHsva(value)).replace(/^#/, ''))

  useEffect(() => {
    if (open) return
    if (value && !isCssColorValue(value)) return

    const next = parseColorToHsva(value)
    setHsva(next)
    setHexDraft(hsvaToHex(next).replace(/^#/, ''))
  }, [value, open])

  const emit = (next: HsvaColor) => {
    setHsva(next)
    setHexDraft(hsvaToHex(next).replace(/^#/, ''))
    if (format === 'hex') {
      onChange(hsvaToHex(next))
      return
    }
    onChange(hsvaToRgbaString(next))
  }

  const rgba = hsvaToRgbaString(hsva)
  const iconColor = getContrastingColor(hsva)
  const isSwatch = variant === 'swatch'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={label}
          className={cn(
            isSwatch &&
              'border-border size-9 shrink-0 rounded-radius grid place-content-center border shadow-sm transition-opacity hover:opacity-90',
            !isSwatch &&
              'border-border bg-card hover:bg-muted/70 flex h-9 w-full items-center gap-2 rounded-radius border px-2.5 text-sm',
            className
          )}
          style={isSwatch ? { backgroundColor: rgba } : undefined}
        >
          {isSwatch && <PipetteIcon className='size-4' style={{ color: iconColor }} />}
          {!isSwatch && (
            <>
              <span className='border-border size-5 shrink-0 rounded-md border' style={{ backgroundColor: rgba }} />
              <PipetteIcon className='size-4 shrink-0 opacity-70' />
              <span className='text-muted-foreground truncate'>{label}</span>
              <span className='text-muted-foreground ml-auto font-mono text-xs uppercase'>#{hexDraft}</span>
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        sideOffset={8}
        className='z-[60] w-[240px] p-3'
        onOpenAutoFocus={event => event.preventDefault()}
        onPointerDown={stopDragLeak}
        onMouseDown={stopDragLeak}
      >
        <div className='flex flex-col gap-3' onPointerDown={stopDragLeak} onMouseDown={stopDragLeak}>
          <Colorful color={hsva} disableAlpha={disableAlpha} style={{ width: '100%' }} onChange={result => emit(result.hsva)} />

          <Input
            variant='soft'
            size='sm'
            value={hexDraft}
            spellCheck={false}
            prefix={<span className='font-mono text-xs'>#</span>}
            onChange={event => {
              const raw = event.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 8)
              setHexDraft(raw)
              if (!validHex(`#${raw}`)) return
              emit(hexToHsva(`#${raw}`))
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker
