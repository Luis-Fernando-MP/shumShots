'use client'

import { FEATURED_THEME_KEYS, type Theme, isLightTheme } from '@app/defaults/themes'
import Button from '@common/components/Button'
import Popup from '@common/components/Popup'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import { CheckIcon } from 'lucide-react'
import { type FC } from 'react'

import useAppTheme from './useAppTheme'

const toCss = (color?: string) => (color ? `rgb(${color})` : 'transparent')

const ThemeOrb = ({ theme, className }: { theme: Theme; className?: string }) => {
  const swatches = [theme['tn-primary'], theme['tn-secondary'], theme['bg-primary']]

  return (
    <span className={cn('flex items-center -space-x-1.5', className)}>
      {swatches.map((color, index) => (
        <span
          key={`${color}-${index}`}
          className='border-border size-3.5 rounded-full border'
          style={{ backgroundColor: toCss(color), zIndex: swatches.length - index }}
        />
      ))}
    </span>
  )
}

const ThemeHero = ({
  name,
  theme,
  selected,
  onSelect
}: {
  name: string
  theme: Theme
  selected: boolean
  onSelect: () => void
}) => (
  <button
    type='button'
    onClick={onSelect}
    className={cn(
      'overflow-hidden rounded-[12px] border text-left transition-colors',
      selected ? 'border-primary' : 'border-border/60 hover:border-border'
    )}
  >
    <div className='h-16 w-full' style={{ backgroundColor: toCss(theme['bg-primary']) }}>
      <div className='flex h-full items-end p-2'>
        <span className='h-6 flex-1 rounded-[8px]' style={{ backgroundColor: toCss(theme['tn-primary']) }} />
        <span className='ml-1 size-6 rounded-full' style={{ backgroundColor: toCss(theme['tn-secondary']) }} />
      </div>
    </div>
    <div className='flex items-center justify-between px-2.5 py-2'>
      <Text.emphasis>{name}</Text.emphasis>
      {selected && <CheckIcon className='text-primary size-3.5' />}
    </div>
  </button>
)

const ThemeSwatch = ({
  name,
  theme,
  selected,
  onSelect
}: {
  name: string
  theme: Theme
  selected: boolean
  onSelect: () => void
}) => (
  <button
    type='button'
    onClick={onSelect}
    title={name}
    aria-label={name}
    className={cn(
      'relative aspect-square overflow-hidden rounded-[12px] border',
      selected ? 'border-primary ring-primary/30 ring-2' : 'border-border/50 hover:border-border'
    )}
    style={{ backgroundColor: toCss(theme['bg-primary']) }}
  >
    <span className='absolute inset-x-0 bottom-0 h-1/3' style={{ backgroundColor: toCss(theme['tn-primary']) }} />
    <span
      className='absolute right-1 bottom-1 size-2.5 rounded-full'
      style={{ backgroundColor: toCss(theme['tn-secondary']) }}
    />
    {selected && <CheckIcon className='text-primary-foreground absolute top-1 left-1 size-3' />}
    <span className='bg-background/80 text-foreground absolute inset-x-0 bottom-0 truncate px-1 py-0.5 text-[10px] opacity-0 transition-opacity hover:opacity-100'>
      {name}
    </span>
  </button>
)

/**
 * Selector de paleta de la consola PIXIS.
 *
 * @returns Orbe del tema activo y popup de paletas.
 */
const ThemeController: FC = () => {
  const { appTheme, THEMES, handleSetTheme } = useAppTheme()
  const current = THEMES[appTheme]

  const featured = FEATURED_THEME_KEYS.flatMap(key => {
    const theme = THEMES[key]
    if (!theme) return []
    return [[key, theme] as [string, Theme]]
  })

  const rest = Object.entries(THEMES).filter(
    ([key]) => !FEATURED_THEME_KEYS.includes(key as (typeof FEATURED_THEME_KEYS)[number])
  )
  const light = rest.filter(([, theme]) => isLightTheme(theme))
  const dark = rest.filter(([, theme]) => !isLightTheme(theme))

  return (
    <Popup className='h-[min(70dvh,640px)] min-h-0 w-[320px]'>
      <Popup.Trigger>
        <Button size='icon' variant='ghost' tooltip={appTheme} className='rounded-[12px]'>
          {current && <ThemeOrb theme={current} />}
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <div className='flex min-w-0 flex-col'>
          <Text.title>Temas</Text.title>
          <Text.caption>{appTheme}</Text.caption>
        </div>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col'>
        <section className='gap-grid flex flex-col'>
          <Text.heading>Principales</Text.heading>
          <div className='grid grid-cols-1 gap-2'>
            {featured.map(([key, theme]) => (
              <ThemeHero
                key={key}
                name={key}
                theme={theme}
                selected={key === appTheme}
                onSelect={() => handleSetTheme(key)}
              />
            ))}
          </div>
        </section>

        {light.length > 0 && (
          <section className='gap-grid flex flex-col'>
            <Text.heading>Claros</Text.heading>
            <div className='grid grid-cols-4 gap-1.5'>
              {light.map(([key, theme]) => (
                <ThemeSwatch
                  key={key}
                  name={key}
                  theme={theme}
                  selected={key === appTheme}
                  onSelect={() => handleSetTheme(key)}
                />
              ))}
            </div>
          </section>
        )}

        {dark.length > 0 && (
          <section className='gap-grid flex flex-col'>
            <Text.heading>Oscuros</Text.heading>
            <div className='grid grid-cols-4 gap-1.5'>
              {dark.map(([key, theme]) => (
                <ThemeSwatch
                  key={key}
                  name={key}
                  theme={theme}
                  selected={key === appTheme}
                  onSelect={() => handleSetTheme(key)}
                />
              ))}
            </div>
          </section>
        )}
      </Popup.Content>
    </Popup>
  )
}

export default ThemeController
