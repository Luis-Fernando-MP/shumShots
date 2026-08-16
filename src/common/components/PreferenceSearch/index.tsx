'use client'

import { Input } from '@common/components/Input'
import { cn } from '@common/utils/cn'
import { Search, X } from 'lucide-react'
import { type FC, useDeferredValue, useState } from 'react'

interface PreferenceSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

/**
 * Campo de búsqueda de preferencias en sidebars.
 */
export const PreferenceSearch: FC<PreferenceSearchProps> = ({ value, onChange, className }) => (
  <div className={cn('relative w-full', className)}>
    <Input
      type='text'
      size='default'
      variant='solid'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder='Buscar…'
      aria-label='Buscar'
      autoComplete='off'
      spellCheck={false}
      prefix={<Search aria-hidden />}
      containerClassName={cn('w-full rounded-[12px]', value && 'pr-9')}
    />
    {value ? (
      <button
        type='button'
        aria-label='Limpiar búsqueda'
        onClick={() => onChange('')}
        className={cn(
          'text-muted-foreground hover:text-foreground absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-[12px]',
          'hover:bg-muted/70 transition-colors',
          'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2'
        )}
      >
        <X className='size-3.5' aria-hidden />
      </button>
    ) : null}
  </div>
)

export const usePreferenceSearchState = (initial = '') => {
  const [query, setQuery] = useState(initial)
  const deferredQuery = useDeferredValue(query)
  return { query, setQuery, deferredQuery }
}

export default PreferenceSearch
