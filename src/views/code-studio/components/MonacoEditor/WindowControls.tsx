'use client'

import { cn } from '@common/utils/cn'
import {
  HEADER_DENSITY_PX,
  MAC_TRAFFIC_PRESETS
} from '@views/code-studio/utils/preferences.config'
import type { PixisChromeState } from '@views/code-studio/utils/preferences.types'
import { Minus, Square, X } from 'lucide-react'
import { type FC } from 'react'

interface WindowControlsProps {
  chrome: PixisChromeState
  className?: string
}

export const WindowControls: FC<WindowControlsProps> = ({ chrome, className }) => {
  if (chrome.controls === 'none') return null

  if (chrome.controls === 'mac') {
    const colors = MAC_TRAFFIC_PRESETS[chrome.macColors]
    return (
      <div className={cn('flex shrink-0 items-center gap-1.5', className)} aria-hidden>
        <span className='size-3 rounded-full' style={{ backgroundColor: colors.close }} />
        <span className='size-3 rounded-full' style={{ backgroundColor: colors.minimize }} />
        <span className='size-3 rounded-full' style={{ backgroundColor: colors.maximize }} />
      </div>
    )
  }

  return (
    <div className={cn('text-current/55 flex shrink-0 items-center gap-0.5', className)} aria-hidden>
      <span className='inline-flex size-6 items-center justify-center'>
        <Minus className='size-3' strokeWidth={1.75} />
      </span>
      <span className='inline-flex size-6 items-center justify-center'>
        <Square className='size-2.5' strokeWidth={1.75} />
      </span>
      <span className='inline-flex size-6 items-center justify-center'>
        <X className='size-3.5' strokeWidth={1.75} />
      </span>
    </div>
  )
}

export const headerHeight = (density: PixisChromeState['headerDensity']) => HEADER_DENSITY_PX[density]
