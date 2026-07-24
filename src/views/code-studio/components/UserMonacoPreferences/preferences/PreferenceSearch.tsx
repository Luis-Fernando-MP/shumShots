'use client'

import { Input } from '@common/ui/Input'
import { cn } from '@common/utils/cn'
import { Search, X } from 'lucide-react'
import { type FC, useDeferredValue, useState } from 'react'

interface PreferenceSearchProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const PreferenceSearch: FC<PreferenceSearchProps> = ({ value, onChange, className }) => (
  <div className={cn('relative w-full', className)}>
    <Input
      type='search'
      size='default'
      variant='outline'
      status='primary'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder='Buscar preferencia…'
      aria-label='Buscar preferencia'
      autoComplete='off'
      spellCheck={false}
      prefix={<Search aria-hidden />}
      containerClassName={cn('w-full', value && 'pr-9')}
    />
    {value ? (
      <button
        type='button'
        aria-label='Limpiar búsqueda'
        onClick={() => onChange('')}
        className={cn(
          'text-muted-foreground hover:text-foreground absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md',
          'hover:bg-muted/70 transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
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
