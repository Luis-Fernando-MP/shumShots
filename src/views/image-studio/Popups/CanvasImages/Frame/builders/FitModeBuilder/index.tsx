'use client'

import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import useFrameStore, {
  createDefaultFrameConfig,
  type FrameFitMode
} from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

const OPTIONS: { value: FrameFitMode; label: string; hint: string }[] = [
  { value: 'cover', label: 'Cubrir', hint: 'Llena la zona verde; puede recortar' },
  { value: 'contain', label: 'Contener', hint: 'Cabe entera; puede dejar bandas' },
  { value: 'fill', label: 'Estirar', hint: 'Estira al ancho y alto de la zona verde' }
]

type Props = { tabId: string; targetIds: string[] }

const PhotoWindow: FC<{ mode: FrameFitMode }> = ({ mode }) => (
  <span className='bg-semantic-success/20 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[8px]'>
    {mode === 'cover' && (
      <span
        className='absolute inset-[-18%] bg-linear-to-br from-primary/80 via-secondary/70 to-primary/40'
        aria-hidden
      />
    )}
    {mode === 'contain' && (
      <span
        className='h-[62%] w-[58%] rounded-[3px] bg-linear-to-br from-primary/80 via-secondary/70 to-primary/40'
        aria-hidden
      />
    )}
    {mode === 'fill' && (
      <span className='absolute inset-0 bg-linear-to-br from-primary/80 via-secondary/70 to-primary/40' aria-hidden />
    )}
  </span>
)

const FitModeBuilder: FC<Props> = ({ tabId }) => {
  const fitMode = useFrameStore(s => s.byTab[tabId]?.fitMode ?? createDefaultFrameConfig().fitMode)
  const setFitMode = useFrameStore(s => s.setFitMode)

  return (
    <SectionBlock title='Ajuste de imagen' description='Cómo encaja la foto en el slot. Con frame, también recorta la zona verde.'>
      <div className='grid grid-cols-3 gap-2'>
        {OPTIONS.map(option => (
          <button
            key={option.value}
            type='button'
            title={option.hint}
            onClick={() => setFitMode(tabId, option.value)}
            className={cn('flex flex-col gap-1.5 p-1.5', chromeTile(fitMode === option.value))}
          >
            <PhotoWindow mode={option.value} />
            <Text.caption className={cn('text-center', fitMode === option.value && 'text-foreground')}>
              {option.label}
            </Text.caption>
          </button>
        ))}
      </div>
    </SectionBlock>
  )
}

export default FitModeBuilder
