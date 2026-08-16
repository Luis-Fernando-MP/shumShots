'use client'

import Button from '@/shared/ui/Button'
import ShumShots from '@/shared/ui/ShumShots'
import { Separator } from '@common/components/Separator'
import { cn } from '@common/utils/cn'
import { AppWindow, LayersIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { CSSProperties, FC, ReactNode } from 'react'

import AboutShumShots from '../AboutShumShots'

interface Props {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const pages = [
  {
    path: '/',
    label: 'Editar código',
    icon: AppWindow
  },
  {
    path: '/editor',
    label: 'Editar imagen',
    icon: LayersIcon
  }
] as const

const MainBar: FC<Props> = ({ className = '', style, children }) => {
  const pathname = usePathname()

  return (
    <article
      className={cn(
        'gap-grid rounded-radius border-border/50 bg-card/50 p-grid-sm backdrop-blur-panel',
        'flex size-fit flex-row items-center justify-center border',
        className
      )}
      style={style}
    >
      <Button href='/' variant='ghost' className='size-auto h-auto shrink-0 rounded-full p-1'>
        <ShumShots size='sm' radius='circle' transparent />
      </Button>

      {children && (
        <>
          <Separator />
          {children}
        </>
      )}

      <Separator />

      <nav className='gap-grid-sm flex flex-row items-center'>
        {pages.map(page => {
          const Icon = page.icon
          const isActive = pathname === page.path

          return (
            <Button
              key={page.path}
              href={page.path}
              size='icon'
              variant='ghost'
              tooltip={page.label}
              isSelected={isActive}
              aria-label={page.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon />
            </Button>
          )
        })}

        <AboutShumShots />
      </nav>
    </article>
  )
}

export default MainBar
