'use client'

import MiniBoxes from '@views/image-studio/Popups/CanvasImages/Layout/components/MiniBoxes'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

type PreviewProps = { active?: boolean; count: number }

export const GridPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='grid' />
export const StaggerPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='stagger' />
export const StackPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='stack' />
export const FanPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='fan' />
export const DiagonalPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='diagonal' />
export const ColumnPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='column' />
export const OrbitPreview: FC<PreviewProps> = props => <MiniBoxes {...props} pattern='orbit' />

type SoloLayout = {
  left: number
  top: number
  w: number
  h: number
  rotateZ?: number
  rotateX?: number
  rotateY?: number
}

const SoloBox: FC<PreviewProps & SoloLayout> = ({
  active,
  left,
  top,
  w,
  h,
  rotateZ = 0,
  rotateX = 0,
  rotateY = 0
}) => {
  const has3d = rotateX !== 0 || rotateY !== 0
  return (
    <div className='relative h-10 w-full overflow-hidden'>
      <div
        className={cn('absolute rounded-[2px]', active ? 'bg-primary' : 'bg-foreground/30')}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: `${w}%`,
          height: `${h}%`,
          transform: has3d
            ? `perspective(160px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotateZ}deg)`
            : `rotate(${rotateZ}deg)`,
          transformOrigin: 'center'
        }}
      />
    </div>
  )
}

export const soloPreview = (layout: SoloLayout): FC<PreviewProps> => {
  const Preview: FC<PreviewProps> = props => <SoloBox {...props} {...layout} />
  return Preview
}
