'use client'

import { cn } from '@common/utils/cn'
import type { BorderConfigurationState } from '@views/image-studio/store/border/createBorderStore'
import type { BorderFinish } from '@views/image-studio/utils/borderFinish'
import {
  resolveBorderColor,
  resolveBorderFinishShadow
} from '@views/image-studio/utils/borderFinish'
import type { CSSProperties, FC } from 'react'

export type FrameTemplate = {
  id: string
  label: string
  finish: BorderFinish
  color: string
  size: number
  matColor: string
  matTop: number
  matRight: number
  matBottom: number
  matLeft: number
  radius: number
}

export const FRAME_TEMPLATES: FrameTemplate[] = [
  {
    id: 'polaroid',
    label: 'Polaroid',
    finish: 'picture',
    color: 'rgba(255, 255, 255, 1)',
    size: 0,
    matColor: 'rgba(255, 255, 255, 1)',
    matTop: 22,
    matRight: 22,
    matBottom: 58,
    matLeft: 22,
    radius: 3
  },
  {
    id: 'marco',
    label: 'Marco',
    finish: 'solid-frame',
    color: 'rgba(52, 42, 34, 1)',
    size: 20,
    matColor: 'rgba(252, 249, 242, 1)',
    matTop: 32,
    matRight: 32,
    matBottom: 32,
    matLeft: 32,
    radius: 2
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    finish: 'soft',
    color: 'rgba(255, 255, 255, 1)',
    size: 8,
    matColor: 'rgba(245, 245, 247, 1)',
    matTop: 18,
    matRight: 18,
    matBottom: 18,
    matLeft: 18,
    radius: 18
  }
]

const TemplatePreview: FC<{ template: FrameTemplate }> = ({ template }) => {
  const stroke = Math.max(0, Math.min(6, Math.round(template.size * 0.28)))
  const padT = Math.max(2, Math.round(template.matTop * 0.28))
  const padR = Math.max(2, Math.round(template.matRight * 0.28))
  const padB = Math.max(4, Math.round(template.matBottom * 0.28))
  const padL = Math.max(2, Math.round(template.matLeft * 0.28))

  const frameStyle: CSSProperties = {
    border: stroke > 0 ? `${stroke}px solid ${resolveBorderColor(template.color, template.finish)}` : 'none',
    boxShadow: resolveBorderFinishShadow(template.finish) ?? '0 2px 8px rgba(0,0,0,0.25)',
    borderRadius: Math.max(1, Math.round(template.radius * 0.28)),
    backgroundColor: template.matColor,
    padding: `${padT}px ${padR}px ${padB}px ${padL}px`
  }

  return (
    <div className='bg-muted/70 flex h-14 w-full items-center justify-center overflow-hidden rounded-md'>
      <div className='h-12 w-9' style={frameStyle}>
        <div className='size-full overflow-hidden rounded-[1px] bg-linear-to-br from-sky-400 via-fuchsia-500 to-amber-400' />
      </div>
    </div>
  )
}

type Props = {
  borderState: BorderConfigurationState
  onApplyRadius?: (radius: number) => void
}

const FrameTemplatePresets: FC<Props> = ({ borderState, onApplyRadius }) => {
  const {
    type,
    finish,
    color,
    size,
    matTop,
    matRight,
    matBottom,
    matLeft,
    setType,
    setFinish,
    setColor,
    setSize,
    setMatColor,
    setMatInsets
  } = borderState

  const isActive = (template: FrameTemplate) =>
    type === 'solid' &&
    finish === template.finish &&
    color === template.color &&
    size === template.size &&
    matTop === template.matTop &&
    matRight === template.matRight &&
    matBottom === template.matBottom &&
    matLeft === template.matLeft

  const apply = (template: FrameTemplate) => {
    setFinish(template.finish)
    setType('solid')
    setColor(template.color)
    setSize(template.size)
    setMatColor(template.matColor)
    setMatInsets({
      top: template.matTop,
      right: template.matRight,
      bottom: template.matBottom,
      left: template.matLeft
    })
    onApplyRadius?.(template.radius)
  }

  return (
    <div className='grid grid-cols-3 gap-1.5'>
      {FRAME_TEMPLATES.map(template => {
        const active = isActive(template)
        return (
          <button
            key={template.id}
            type='button'
            onClick={() => apply(template)}
            className={cn(
              'flex flex-col gap-0.5 rounded-md p-1 text-left transition-colors',
              active ? 'bg-secondary ring-primary/40 ring-1' : 'hover:bg-muted/50'
            )}
          >
            <TemplatePreview template={template} />
            <span className='text-muted-foreground px-0.5 text-center text-[10px] leading-tight font-medium'>
              {template.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default FrameTemplatePresets
