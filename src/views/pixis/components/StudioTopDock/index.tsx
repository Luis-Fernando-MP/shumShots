'use client'

import Button from '@common/components/Button'
import { Separator } from '@common/components/Separator'
import ThemeController from '@common/components/ThemeController'
import AboutShumShots from '@views/pixis/components/AboutShumShots'
import DetailBar from '@views/pixis/components/DetailBar'
import FullScreen from '@views/pixis/components/HeaderBar/FullScreen'
import ZoomController from '@views/pixis/components/HeaderBar/ZoomController'
import SystemGridPopup from '@views/pixis/components/SystemGridPopup'
import { AppWindow, LayersIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { type FC } from 'react'

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

/**
 * Chrome superior compartido por ambos estudios.
 */
const StudioTopDock: FC = () => {
  const pathname = usePathname()

  return (
    <>
      <div className='flex items-center gap-0.5'>
        <ThemeController />
        <FullScreen />
        <ZoomController />
      </div>
      <Separator />
      <div className='flex items-center gap-0.5'>
        <SystemGridPopup />
        <DetailBar />
        <AboutShumShots />
      </div>
      <Separator />
      <nav className='flex flex-row items-center gap-0.5'>
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
      </nav>
    </>
  )
}

export default StudioTopDock
