'use client'

import { cn } from '@common/utils/cn'
import useFrameStore, {
  createDefaultFrameConfig,
  type FrameFitMode
} from '@views/image-studio/Popups/FrameConfiguration/store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const OPTIONS: { value: FrameFitMode; label: string; hint: string }[] = [
  { value: 'cover', label: 'Cubrir', hint: 'Llena la zona verde; puede recortar' },
  { value: 'contain', label: 'Contener', hint: 'Cabe entera; puede dejar bandas' },
  { value: 'fill', label: 'Estirar', hint: 'Estira al ancho y alto de la zona verde' }
]

type Props = { tabId: string }

const FitModeSection: FC<Props> = ({ tabId }) => {
  const fitMode = useFrameStore(
    s => s.byTab[tabId]?.fitMode ?? createDefaultFrameConfig().fitMode
  )
  const setFitMode = useFrameStore(s => s.setFitMode)

  return (
    <SectionBlock
      title='Ajuste de imagen'
      description='Cómo encaja la foto dentro de la zona verde del frame.'
    >
      <div className='grid grid-cols-3 gap-1.5'>
        {OPTIONS.map(option => (
          <button
            key={option.value}
            type='button'
            title={option.hint}
            onClick={() => setFitMode(tabId, option.value)}
            className={cn(
              'border-border/70 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex h-9 items-center justify-center rounded-radius border px-1 text-[11px] font-medium transition-colors',
              fitMode === option.value &&
                'border-primary bg-secondary/40 text-foreground ring-primary/50 ring-1'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </SectionBlock>
  )
}

export default FitModeSection
