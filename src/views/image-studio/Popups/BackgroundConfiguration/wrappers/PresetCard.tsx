'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import type { FC, ReactNode } from 'react'

type Props = {
  active: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}

const PresetCard: FC<Props> = ({ active, onClick, children, className }) => (
  <Button
    type='button'
    variant={active ? 'secondary' : 'outline'}
    size='sm'
    onClick={onClick}
    className={cn('flex h-auto flex-col gap-1.5 px-1 py-2', active && 'ring-primary/40 ring-1', className)}
  >
    {children}
  </Button>
)

export default PresetCard
