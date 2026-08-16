'use client'

import Button from '@common/components/Button'
import Popup from '@common/components/Popup'
import Text from '@common/components/Text'
import { KeyboardIcon } from 'lucide-react'
import { type FC } from 'react'

const SHORTCUTS = [
  { title: 'Pan', keys: ['Ctrl', 'Click'] },
  { title: 'Zoom', keys: ['Ctrl', 'Scroll'] },
  { title: 'Mover popup', keys: ['Ctrl', 'Click'] },
  { title: 'Cerrar popup', keys: ['Ctrl', 'X'] },
  { title: 'Cerrar popup', keys: ['Esc'] },
  { title: 'Mover imagen', keys: ['Alt', 'Arrastrar'] },
  { title: 'Mover imagen', keys: ['Shift', 'Arrastrar'] },
  { title: 'Copiar slot', keys: ['Alt', 'Arrastrar'] },
  { title: 'Deshacer', keys: ['Ctrl', 'Z'] },
  { title: 'Rehacer', keys: ['Ctrl', 'Y'] }
] as const

const Kbd = ({ children }: { children: string }) => (
  <Text.emphasis className='border-border/80 bg-muted inline-flex min-w-7 items-center justify-center rounded-[12px] border px-1.5 py-1 text-[11px] leading-none'>
    {children}
  </Text.emphasis>
)

/**
 * Atajos del estudio en el dock superior.
 */
const DetailBar: FC = () => (
  <Popup className='h-auto min-h-0 w-[300px]'>
    <Popup.Trigger>
      <Button size='icon' variant='ghost' tooltip='Atajos'>
        <KeyboardIcon />
      </Button>
    </Popup.Trigger>

    <Popup.Header>Atajos</Popup.Header>

    <Popup.Content className='flex flex-col gap-1.5'>
      {SHORTCUTS.map((item, index) => (
        <div key={`${item.title}-${index}`} className='flex items-center justify-between gap-3 py-0.5'>
          <Text.caption>{item.title}</Text.caption>
          <div className='flex items-center gap-1'>
            {item.keys.map((key, keyIndex) => (
              <span key={`${key}-${keyIndex}`} className='contents'>
                {keyIndex > 0 && <Text.caption>+</Text.caption>}
                <Kbd>{key}</Kbd>
              </span>
            ))}
          </div>
        </div>
      ))}
    </Popup.Content>
  </Popup>
)

export default DetailBar
