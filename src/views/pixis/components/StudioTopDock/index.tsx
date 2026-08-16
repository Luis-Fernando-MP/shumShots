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
 *
 * @returns Tema, zoom, sistema, atajos, about y cambio de estudio.
 */
const StudioTopDock: FC = () => {
  const pathname = usePathname()

  return (
    <>
      <ThemeController />
      <FullScreen />
      <Separator />
      <ZoomController />
      <Separator />
      <SystemGridPopup />
      <DetailBar />
      <AboutShumShots />
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
      </nav>
    </>
  )
}

export default StudioTopDock
