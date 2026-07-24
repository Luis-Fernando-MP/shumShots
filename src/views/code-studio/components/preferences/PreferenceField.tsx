'use client'

import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import { createContext, useContext, type ReactNode } from 'react'

const PreferenceSearchContext = createContext('')

export const PreferenceSearchProvider = ({
  query,
  children
}: {
  query: string
  children: ReactNode
}) => <PreferenceSearchContext.Provider value={query}>{children}</PreferenceSearchContext.Provider>

export const usePreferenceSearch = () => useContext(PreferenceSearchContext)

const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()

const nodeToSearchText = (value: ReactNode): string => {
  if (value == null || typeof value === 'boolean') return ''
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(nodeToSearchText).join(' ')
  if (typeof value === 'object' && 'props' in value) {
    const props = value.props as { children?: ReactNode }
    return nodeToSearchText(props.children)
  }
  return ''
}

export const matchesPreferenceSearch = (query: string, parts: ReactNode[]) => {
  const q = normalizeSearchText(query.trim())
  if (!q) return true
  const haystack = normalizeSearchText(parts.map(nodeToSearchText).join(' '))
  return q.split(/\s+/).every(token => token.length > 0 && haystack.includes(token))
}

interface PreferenceFieldProps {
  title: string
  subtitle?: ReactNode
  description?: ReactNode
  example?: ReactNode
  note?: ReactNode
  keywords?: string
  children: ReactNode
  className?: string
}

export const PreferenceField = ({
  title,
  subtitle,
  description,
  example,
  note,
  keywords,
  children,
  className
}: PreferenceFieldProps) => {
  const query = usePreferenceSearch()
  if (!matchesPreferenceSearch(query, [title, subtitle, description, example, note, keywords])) {
    return null
  }

  return (
    <div data-preference-field className={cn('flex flex-col gap-2', className)}>
      <div className='flex flex-col gap-1'>
        <Typography.Emphasis className='leading-snug'>{title}</Typography.Emphasis>

        {subtitle != null && (
          <Typography.Small weight='medium' className='text-foreground/70 leading-snug'>
            {subtitle}
          </Typography.Small>
        )}

        {description != null && (
          <Typography.Paragraph tone='secondary' className='m-0 leading-snug'>
            {description}
          </Typography.Paragraph>
        )}

        {example != null && <Typography.Cite className='text-muted-foreground'>{example}</Typography.Cite>}

        {note != null && (
          <Typography.Text className='leading-snug'>
            <Typography.Precaution>{note}</Typography.Precaution>
          </Typography.Text>
        )}
      </div>

      <div className='flex flex-wrap items-center gap-1.5'>{children}</div>
    </div>
  )
}

interface PreferencePanelProps {
  children: ReactNode
  className?: string
}

export const PreferencePanel = ({ children, className }: PreferencePanelProps) => (
  <div
    className={cn(
      'border-border/40 bg-card/40 flex flex-col gap-3 rounded-md border border-l-[3px] border-l-primary/70 p-3',
      '[&:not(:has([data-preference-field]))]:hidden',
      className
    )}
  >
    {children}
  </div>
)

interface PreferenceSectionProps {
  title: string
  subtitle?: ReactNode
  keywords?: string
  children: ReactNode
  className?: string
}

export const PreferenceSection = ({ title, subtitle, keywords, children, className }: PreferenceSectionProps) => {
  const query = usePreferenceSearch()
  // Solo el título abre toda la sección; el subtítulo no debe mostrar todos los campos.
  const titleHit = matchesPreferenceSearch(query, [title, keywords])
  const childQuery = titleHit ? '' : query

  return (
    <PreferenceSearchProvider query={childQuery}>
      <Typography.Block
        title={title}
        data-preference-section
        className={cn('gap-3', query && '[&:not(:has([data-preference-field]))]:hidden', className)}
      >
        {subtitle != null && (
          <Typography.Paragraph tone='secondary' className='m-0 -mt-1 leading-snug'>
            {subtitle}
          </Typography.Paragraph>
        )}
        <div className='flex flex-col gap-3.5'>{children}</div>
      </Typography.Block>
    </PreferenceSearchProvider>
  )
}

interface PreferenceToggleProps<T extends string | number | boolean> {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  label?: (option: T) => ReactNode
  normal?: T
}

export function PreferenceToggle<T extends string | number | boolean>({
  value,
  options,
  onChange,
  label,
  normal
}: PreferenceToggleProps<T>) {
  return (
    <>
      {options.map(option => {
        const isNormal = normal !== undefined && option === normal
        const text =
          label?.(option) ??
          (typeof option === 'boolean' ? (option ? 'On' : 'Off') : isNormal ? 'Normal' : String(option))

        return (
          <Button
            key={String(option)}
            size='sm'
            variant='soft'
            isSelected={value === option}
            onClick={() => onChange(option)}
          >
            {text}
          </Button>
        )
      })}
    </>
  )
}
