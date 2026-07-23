'use client'

import Button from '@/shared/ui/Button'
import ShumShots from '@/shared/ui/ShumShots'
import { Separator } from '@common/ui/Separator'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import { ArrowUpRightIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import Link from 'next/link'
import { type FC, type ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface Props {
  className?: string
}

const SHORTCUTS = [
  {
    title: 'Navegar',
    hint: 'Mueve el tablero',
    rows: [['Ctrl', 'Click']]
  },
  {
    title: 'Zoom',
    hint: 'Ajusta la escala',
    rows: [['Ctrl', 'Scroll']]
  },
  {
    title: 'Modales',
    hint: 'Arrastrar y cerrar',
    rows: [
      ['Ctrl', 'Click'],
      ['Ctrl', 'X', 'Esc']
    ]
  },
  {
    title: 'Historial',
    hint: 'Deshacer y rehacer',
    rows: [['Ctrl', 'Z', 'Ctrl', 'Y']]
  }
] as const

const Kbd = ({ children }: { children: string }) => (
  <Typography.Text
    weight='medium'
    className='border-border/80 bg-background/80 text-foreground inline-flex min-w-7 items-center justify-center rounded-md border px-2 py-1 text-sm leading-none shadow-sm'
  >
    {children}
  </Typography.Text>
)

const ShortcutKeys = ({ keys }: { keys: readonly string[] }) => {
  const isPairCombo = keys.length === 4 && keys[0] === 'Ctrl' && keys[2] === 'Ctrl'

  if (isPairCombo) {
    return (
      <div className='flex flex-wrap items-center gap-1.5'>
        <Kbd>{keys[0]}</Kbd>
        <Typography.Small>+</Typography.Small>
        <Kbd>{keys[1]}</Kbd>
        <Typography.Small className='px-0.5'>/</Typography.Small>
        <Kbd>{keys[2]}</Kbd>
        <Typography.Small>+</Typography.Small>
        <Kbd>{keys[3]}</Kbd>
      </div>
    )
  }

  if (keys.length === 3 && keys[2] === 'Esc') {
    return (
      <div className='flex flex-wrap items-center gap-1.5'>
        <Kbd>{keys[0]}</Kbd>
        <Typography.Small>+</Typography.Small>
        <Kbd>{keys[1]}</Kbd>
        <Typography.Small className='px-0.5'>ó</Typography.Small>
        <Kbd>{keys[2]}</Kbd>
      </div>
    )
  }

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className='contents'>
          {index > 0 && <Typography.Small>+</Typography.Small>}
          <Kbd>{key}</Kbd>
        </span>
      ))}
    </div>
  )
}

const ShortcutBlock = ({ title, hint, children }: { title: string; hint: string; children: ReactNode }) => (
  <section className='flex flex-col gap-2.5'>
    <div className='flex flex-col gap-0.5'>
      <Typography.Label className='text-foreground tracking-wide'>{title}</Typography.Label>
      <Typography.Paragraph tone='secondary' className='m-0 leading-snug'>
        {hint}
      </Typography.Paragraph>
    </div>
    {children}
  </section>
)

const DetailBar: FC<Props> = ({ className }) => {
  const [isOpen, setIsOpen] = useLocalStorage('detailBar', true)

  return (
    <article
      className={cn(
        'rounded-radius border-border/50 bg-card/50 backdrop-blur-panel pointer-events-auto relative flex w-[300px] flex-col overflow-hidden border select-none',
        'transition-[max-height,padding] duration-300 ease-out',
        isOpen ? 'max-h-[calc(100dvh-2.5rem)]' : 'max-h-14',
        className
      )}
    >
      <header
        className={cn('relative flex shrink-0 items-center gap-3', isOpen ? 'px-grid pt-grid pb-grid-sm' : 'h-14 px-3 py-2')}
      >
        <Link href='/' className={cn('group flex min-w-0 flex-1 items-center gap-3 no-underline', isOpen && 'items-start')}>
          <ShumShots size={isOpen ? 'sm' : 'xs'} transparent />
          <div className='flex min-w-0 flex-col gap-0.5'>
            <Typography.Title
              className={cn(
                'text-foreground group-hover:text-primary tracking-[0.12em] transition-colors',
                isOpen ? 'text-2xl' : 'text-lg leading-none'
              )}
            >
              PIXIS
            </Typography.Title>
            {isOpen && (
              <Typography.Text tone='secondary' className='leading-snug'>
                Estudio de código e imagen
              </Typography.Text>
            )}
          </div>
        </Link>

        <Button
          size='icon'
          variant='ghost'
          tooltip={isOpen ? 'Contraer' : 'Expandir'}
          tooltipPosition='left'
          onClick={() => setIsOpen(prev => !prev)}
          className='size-8 shrink-0'
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronUpIcon className='size-4' /> : <ChevronDownIcon className='size-4' />}
        </Button>
      </header>

      {isOpen && (
        <div className='px-grid pb-grid gap-grid scrollbar-hidden flex flex-col overflow-y-auto'>
          <Separator orientation='horizontal' className='opacity-70' />

          <div className='gap-grid-lg flex flex-col'>
            {SHORTCUTS.map(item => (
              <ShortcutBlock key={item.title} title={item.title} hint={item.hint}>
                <div className='flex flex-col gap-2'>
                  {item.rows.map((keys, index) => (
                    <ShortcutKeys key={`${item.title}-${index}`} keys={keys} />
                  ))}
                </div>
              </ShortcutBlock>
            ))}
          </div>

          <Separator orientation='horizontal' className='opacity-70' />

          <Button status='primary' href='/editor' className='w-full justify-between'>
            Abrir editor
            <ArrowUpRightIcon />
          </Button>
        </div>
      )}
    </article>
  )
}

export default DetailBar
