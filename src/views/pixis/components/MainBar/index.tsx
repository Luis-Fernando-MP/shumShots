'use client'

import MainBarOptions from '@views/code-studio/components/MainBarOptions'
import EditorMainBarOptions from '@views/image-studio/components/MainBarOptions'
import Button from '@/shared/ui/Button'
import ShumShots from '@/shared/ui/ShumShots'
import { AppWindow, LayersIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'

import AboutShumShots from '../AboutShumShots'

interface Props {
  className?: string
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
]

const mainBarPages = {
  '/': MainBarOptions,
  '/editor': EditorMainBarOptions
}

const MainBar: FC<Props> = ({ className = '' }) => {
  const pathname = usePathname()

  const RenderForPage = mainBarPages[pathname as keyof typeof mainBarPages]

  return (
    <article className={`flex size-fit flex-row items-center justify-center gap-grid-xl rounded-lg border bg-background/80 p-grid backdrop-blur-panel ${className}`}>
      <Link href='/' aria-label='Volver a la página principal'>
        <ShumShots size='sm' radius='circle' transparent />
      </Link>

      {RenderForPage && <RenderForPage />}

      <div className='h-6 w-px bg-border' />

      <section className='flex flex-row items-center gap-grid'>
        {pages.map(page => (
          <Link key={page.path} href={page.path} aria-label={page.label}>
            <Button tooltip={page.label} active={pathname === page.path}>
              <page.icon />
            </Button>
          </Link>
        ))}
        <AboutShumShots />
      </section>
    </article>
  )
}

export default MainBar
