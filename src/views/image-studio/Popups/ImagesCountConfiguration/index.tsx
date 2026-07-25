'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { cn } from '@common/utils/cn'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { LayoutGridIcon } from 'lucide-react'
import { type FC } from 'react'

import SectionBlock from '../BackgroundConfiguration/wrappers/SectionBlock'

const COUNTS = [1, 2, 3, 4, 5] as const

const LayoutPreview: FC<{ count: number }> = ({ count }) => {
  const layout = getPictureLayout(count)
  return (
    <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
      {layout.map((rect, index) => (
        <div
          key={index}
          className='bg-primary/35 border-primary/50 absolute rounded-[2px] border'
          style={{
            left: `${rect.x}%`,
            top: `${rect.y}%`,
            width: `${rect.w}%`,
            height: `${rect.h}%`
          }}
        />
      ))}
    </div>
  )
}

const ImagesCountConfiguration: FC = () => {
  const count = usePicturesStore(s => s.count)
  const setCount = usePicturesStore(s => s.setCount)

  return (
    <Popup className='h-[420px] w-[320px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Cantidad de imágenes'>
          <LayoutGridIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Imágenes · Layout</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs'>
        <SectionBlock title='Cantidad' description='Elige de 1 a 5 imágenes en el canvas.'>
          <div className='grid grid-cols-5 gap-1.5'>
            {COUNTS.map(value => {
              const active = count === value
              return (
                <button
                  key={value}
                  type='button'
                  onClick={() => setCount(value)}
                  className={cn(
                    'flex flex-col gap-1 rounded-md p-1 transition-colors',
                    active ? 'bg-secondary ring-primary/40 ring-1' : 'hover:bg-muted/50'
                  )}
                >
                  <LayoutPreview count={value} />
                  <span className='text-muted-foreground text-center text-[10px] font-medium'>{value}</span>
                </button>
              )
            })}
          </div>
        </SectionBlock>
      </Popup.Content>
    </Popup>
  )
}

export default ImagesCountConfiguration
