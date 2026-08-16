'use client'

import Button from '@common/components/Button'
import Popup from '@common/components/Popup'
import { Separator } from '@common/components/Separator'
import Typography from '@common/components/Typography'
import { KeyboardIcon } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

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
    className='border-border/80 bg-background/80 text-foreground inline-flex min-w-7 items-center justify-center rounded-[12px] border px-2 py-1 text-sm leading-none shadow-sm'
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

/**
 * Atajos del estudio como Popup, disparado por un botón del top dock.
 *
 * @returns El trigger y el diálogo de atajos.
 */
const DetailBar: FC = () => (
  <Popup className='h-auto min-h-0 w-[320px]'>
    <Popup.Trigger>
      <Button size='icon' variant='ghost' tooltip='Atajos'>
        <KeyboardIcon />
      </Button>
    </Popup.Trigger>

    <Popup.Header>Atajos</Popup.Header>

    <Popup.Content className='gap-grid-lg flex flex-col'>
      {SHORTCUTS.map((item, index) => (
        <div key={item.title} className='gap-grid-lg flex flex-col'>
          {index > 0 && <Separator orientation='horizontal' className='opacity-70' />}
          <ShortcutBlock title={item.title} hint={item.hint}>
            <div className='flex flex-col gap-2'>
              {item.rows.map((keys, rowIndex) => (
                <ShortcutKeys key={`${item.title}-${rowIndex}`} keys={keys} />
              ))}
            </div>
          </ShortcutBlock>
        </div>
      ))}
    </Popup.Content>
  </Popup>
)

export default DetailBar
