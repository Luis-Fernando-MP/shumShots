'use client'

import Button from '@/shared/ui/Button'
import LabelText from '@/shared/ui/LabelText'
import ShumShots from '@/shared/ui/ShumShots'
import { ArrowBigDownDashIcon, ArrowBigUpDashIcon } from 'lucide-react'
import Link from 'next/link'
import { type FC, type ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface Props {
  className?: string
}

const ShortcutRow = ({ children }: { children: ReactNode }) => (
  <div className='text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm'>{children}</div>
)

const DetailBar: FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useLocalStorage('detailBar', true)

  return (
    <article
      className={`rounded-radius border-border/60 bg-background/80 backdrop-blur-panel pointer-events-auto relative flex w-[250px] overflow-x-hidden border text-sm select-none ${
        isOpen
          ? 'gap-grid-xl px-grid pb-grid h-fit max-h-[calc(100dvh-2.5rem)] flex-col overflow-y-auto pt-12'
          : 'h-14 flex-row items-center overflow-hidden py-2 pr-12 pl-3'
      } ${className}`}
    >
      <Button
        tooltip={isOpen ? 'Contraer' : 'Expandir'}
        tooltipPosition='left'
        onClick={() => setIsOpen(prev => !prev)}
        className={`absolute right-2 z-10 ${isOpen ? 'top-2' : 'top-1/2 -translate-y-1/2'}`}
      >
        {isOpen ? <ArrowBigUpDashIcon /> : <ArrowBigDownDashIcon />}
      </Button>

      <Link href='/' className={`flex items-center gap-2 ${isOpen ? 'flex-col items-start' : 'flex-row'}`}>
        <ShumShots size={isOpen ? 'md' : 'xs'} transparent />
        <span className='text-foreground text-sm leading-none font-medium'>PIXIS</span>
      </Link>

      {isOpen && (
        <>
          <section className='flex flex-col gap-2'>
            <p className='text-muted-foreground m-0 text-sm leading-relaxed'>Navega por el dashboard utilizando:</p>
            <ShortcutRow>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>Click</LabelText>
            </ShortcutRow>
          </section>

          <section className='flex flex-col gap-2'>
            <p className='text-muted-foreground m-0 text-sm leading-relaxed'>Ajusta la escala con:</p>
            <ShortcutRow>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>Scroll</LabelText>
              <span>/</span>
              <LabelText>Touchpad</LabelText>
            </ShortcutRow>
          </section>

          <section className='flex flex-col gap-2'>
            <p className='text-muted-foreground m-0 text-sm leading-relaxed'>Facilita tu movilidad en los modales con:</p>
            <ShortcutRow>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>click</LabelText>
            </ShortcutRow>
            <p className='text-muted-foreground m-0 text-sm leading-relaxed'>Y para cerrar un modal con:</p>
            <ShortcutRow>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>x</LabelText>
              <span>ó</span>
              <LabelText>Escape</LabelText>
            </ShortcutRow>
          </section>

          <section className='flex flex-col gap-2'>
            <p className='text-muted-foreground m-0 text-sm leading-relaxed'>
              Además, puedes avanzar y retroceder en el historial del editor usando:
            </p>
            <ShortcutRow>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>Z</LabelText>
              <span>/</span>
              <LabelText>Ctrl</LabelText>
              <span>+</span>
              <LabelText>Y</LabelText>
            </ShortcutRow>
          </section>

          <p className='text-muted-foreground m-0 text-sm leading-relaxed'>
            Finalmente, puedes editar tu <span className='text-foreground font-medium'>Shot</span> en la página{' '}
            <Link href='/editor' className='text-primary font-medium underline-offset-2 hover:underline'>
              /editor
            </Link>
          </p>
        </>
      )}
    </article>
  )
}

export default DetailBar
