import { acl } from '@/shared/acl'
import { Theme } from '@app/defaults/themes'
import type { ButtonHTMLAttributes, FC } from 'react'

import Button from '../Button'
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  theme: Pick<Theme, 'tn-primary' | 'tn-secondary' | 'bg-primary'>
  selected?: boolean
}

/**
 * @param {string} title - The title of the palette sphere.
 * @param {Theme} theme - The theme of the palette sphere, type of Theme.
 * @param {boolean} selected - Whether the palette sphere is selected.
 * @param {ButtonHTMLAttributes<HTMLButtonElement>} props - The props of the button palette sphere.
 */

const PaletteSphere: FC<Props> = ({ title, theme, className = '', selected = false, ...props }) => {
  if (!theme) return null

  const parseColor = (color: string | null) => {
    if (!color) return ''
    if (color?.includes('#')) return color
    return `rgb(${color})`
  }

  return (
    <Button className={`relative flex min-h-10 flex-row items-center gap-3 overflow-hidden rounded-md border-2 border-transparent bg-card p-1 ${selected ? 'border-primary' : ''} ${className}`} tooltip={title} {...props}>
      <div className='absolute inset-0 overflow-hidden rounded-md after:absolute after:left-[20%] after:top-1/2 after:size-[60px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-background after:blur-lg' />
      <div className='relative z-10 flex flex-row items-center gap-1'>
        <div className='size-5 rounded-full border-[1.5px] border-muted' style={{ backgroundColor: parseColor(theme['tn-primary']) }} />
        <div className='size-5 rounded-full border-[1.5px] border-muted' style={{ backgroundColor: parseColor(theme['tn-secondary']) }} />
        <div className='size-5 rounded-full border-[1.5px] border-muted' style={{ backgroundColor: parseColor(theme['bg-primary']) }} />
      </div>

      <p className='relative z-10 max-w-[55px] overflow-hidden text-ellipsis text-nowrap'>{title}</p>
    </Button>
  )
}
export default PaletteSphere
