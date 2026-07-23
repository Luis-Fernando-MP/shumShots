'use client'

import Button from '@/shared/ui/Button'
import LabelText from '@/shared/ui/LabelText'
import ShumShots from '@/shared/ui/ShumShots'
import { Separator } from '@common/ui/Separator'
import { Typography } from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
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

const ShortcutBlock = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className='flex flex-col gap-2'>
    <Typography as='h3' size='sm' weight='semibold' face='display' className='text-foreground/90 tracking-wide uppercase'>
      {title}
    </Typography>
    {children}
  </section>
)

const DetailBar: FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useLocalStorage('detailBar', true)

  return (
    <article
      className={cn(
        'rounded-radius border-border/60 bg-card/55 backdrop-blur-panel pointer-events-auto relative flex w-[280px] overflow-x-hidden border select-none',
        isOpen
          ? 'gap-grid-lg px-grid pb-grid h-fit max-h-[calc(100dvh-2.5rem)] flex-col overflow-y-auto pt-12'
          : 'h-14 flex-row items-center overflow-hidden py-2 pr-12 pl-3',
        className
      )}
    >
      <Button
        size='icon'
        variant='ghost'
        tooltip={isOpen ? 'Contraer' : 'Expandir'}
        tooltipPosition='left'
        onClick={() => setIsOpen(prev => !prev)}
        className={cn('absolute right-2 z-10', isOpen ? 'top-2' : 'top-1/2 -translate-y-1/2')}
      >
        {isOpen ? <ArrowBigUpDashIcon /> : <ArrowBigDownDashIcon />}
      </Button>

      <Link
        href='/'
        className={cn('group flex min-w-0 gap-3 no-underline', isOpen ? 'flex-col items-start' : 'flex-row items-center')}
      >
        <ShumShots size={isOpen ? 'md' : 'xs'} transparent />
        <div className={cn('flex min-w-0 flex-col', isOpen ? 'gap-1' : 'gap-0')}>
          <Typography
            as='span'
            face='display'
            weight='bold'
            size={isOpen ? '2xl' : 'lg'}
            className='text-foreground group-hover:text-primary tracking-[0.14em] transition-colors'
          >
            PIXIS
          </Typography>
          {isOpen && (
            <Typography as='span' size='sm' tone='secondary' className='tracking-wide'>
              Code & image studio
            </Typography>
          )}
        </div>
        {isOpen && <span className='bg-primary h-0.5 w-10 rounded-full' aria-hidden />}
      </Link>

      {isOpen && (
        <>
          <Separator orientation='horizontal' className='bg-border/80 h-px w-full' />

          <div className='gap-grid flex flex-col'>
            <ShortcutBlock title='Navegar'>
              <Typography as='p' size='sm' tone='secondary'>
                Mueve el tablero
              </Typography>
              <ShortcutRow>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>Click</LabelText>
              </ShortcutRow>
            </ShortcutBlock>

            <ShortcutBlock title='Zoom'>
              <Typography as='p' size='sm' tone='secondary'>
                Ajusta la escala
              </Typography>
              <ShortcutRow>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>Scroll</LabelText>
              </ShortcutRow>
            </ShortcutBlock>

            <ShortcutBlock title='Modales'>
              <Typography as='p' size='sm' tone='secondary'>
                Arrastrar y cerrar
              </Typography>
              <ShortcutRow>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>Click</LabelText>
              </ShortcutRow>
              <ShortcutRow>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>X</LabelText>
                <span>ó</span>
                <LabelText className='text-sm'>Esc</LabelText>
              </ShortcutRow>
            </ShortcutBlock>

            <ShortcutBlock title='Historial'>
              <Typography as='p' size='sm' tone='secondary'>
                Deshacer y rehacer
              </Typography>
              <ShortcutRow>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>Z</LabelText>
                <span>/</span>
                <LabelText className='text-sm'>Ctrl</LabelText>
                <span>+</span>
                <LabelText className='text-sm'>Y</LabelText>
              </ShortcutRow>
            </ShortcutBlock>
          </div>

          <Separator orientation='horizontal' className='bg-border/80 h-px w-full' />

          <Typography as='p' size='sm' tone='secondary' className='leading-relaxed'>
            Edita tu shot en{' '}
            <Link href='/editor' className='text-primary font-medium underline-offset-2 hover:underline'>
              /editor
            </Link>
          </Typography>
        </>
      )}
    </article>
  )
}

export default DetailBar
