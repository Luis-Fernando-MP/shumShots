'use client'

import SizeController from '@/shared/components/SizeController'
import { cn } from '@common/utils/cn'
import { BACKGROUND_SIZE_PRESETS } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import PresetCard from './PresetCard'
import SectionBlock from './SectionBlock'

const AspectThumb: FC<{ width: number; height: number; active: boolean }> = ({ width, height, active }) => {
  const ratio = width / height
  const max = 28
  const boxW = ratio >= 1 ? max : Math.max(10, Math.round(max * ratio))
  const boxH = ratio >= 1 ? Math.max(10, Math.round(max / ratio)) : max

  return (
    <div className='bg-muted flex h-10 w-full items-center justify-center rounded-md'>
      <div
        className={cn('rounded-sm border', active ? 'border-primary bg-primary/25' : 'border-border/70 bg-card/80')}
        style={{ width: boxW, height: boxH }}
      />
    </div>
  )
}

const BackgroundSizeController: FC = () => {
  const backgroundWidth = useBackgroundStore(s => s.backgroundWidth)
  const backgroundHeight = useBackgroundStore(s => s.backgroundHeight)
  const setBackgroundWidth = useBackgroundStore(s => s.setBackgroundWidth)
  const setBackgroundHeight = useBackgroundStore(s => s.setBackgroundHeight)
  const setBackgroundSize = useBackgroundStore(s => s.setBackgroundSize)

  return (
    <SectionBlock title='Tamaño' description='Presets de redes o tamaño libre del canvas.'>
      <div className='grid grid-cols-4 gap-1.5'>
        {BACKGROUND_SIZE_PRESETS.map(item => {
          const active = backgroundWidth === item.width && backgroundHeight === item.height
          return (
            <PresetCard
              key={item.id}
              active={active}
              onClick={() => setBackgroundSize(item.width, item.height)}
              className='gap-1 px-1 py-1.5'
            >
              <AspectThumb width={item.width} height={item.height} active={active} />
              <span className='text-[10px] font-medium leading-tight'>{item.label}</span>
              {item.isDefault && <span className='text-muted-foreground text-[9px]'>Default</span>}
            </PresetCard>
          )
        })}
      </div>

      <SizeController
        width={backgroundWidth}
        height={backgroundHeight}
        setWidth={setBackgroundWidth}
        setHeight={setBackgroundHeight}
      />
    </SectionBlock>
  )
}

export default BackgroundSizeController
