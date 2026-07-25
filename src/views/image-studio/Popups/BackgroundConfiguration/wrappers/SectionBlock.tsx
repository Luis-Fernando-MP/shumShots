'use client'

import Typography from '@common/ui/Typography'
import type { FC, ReactNode } from 'react'

type Props = {
  title: string
  level?: 1 | 2
  description?: string
  children: ReactNode
}

const SectionBlock: FC<Props> = ({ title, level = 1, description, children }) => {
  const prefix = level === 1 ? '#' : '##'

  return (
    <section className='gap-grid flex flex-col'>
      <div className='flex flex-col gap-0.5'>
        <Typography.Label size='xs' weight='semibold' className='text-foreground tracking-wide'>
          {prefix} {title}
        </Typography.Label>
        {description && (
          <Typography.Small tone='secondary' className='text-[10px] leading-relaxed'>
            {description}
          </Typography.Small>
        )}
      </div>
      {children}
    </section>
  )
}

export default SectionBlock
