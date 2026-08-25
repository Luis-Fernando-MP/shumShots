import Text from '@/common/components/Text'
import { chromeTile } from '@/common/utils/chrome'
import { cn } from '@common/utils/cn'
import { type FC } from 'react'

const FormatStage: FC<{ width: number; height: number; label: string; active: boolean }> = ({ width, height, label, active }) => {
  const landscape = width >= height

  return (
    <div className='flex flex-col items-center gap-1'>
      <div className={cn('grid h-9 w-full place-content-center', chromeTile(active))}>
        <div
          className={cn('rounded-[2px]', active ? 'bg-primary' : 'bg-foreground')}
          style={{
            aspectRatio: `${width} / ${height}`,
            width: landscape ? '22px' : undefined,
            height: landscape ? undefined : '22px'
          }}
        />
      </div>
      <Text.caption className='text-center'>{label}</Text.caption>
    </div>
  )
}

export default FormatStage
