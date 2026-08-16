'use client'

import { SearchIcon } from 'lucide-react'
import { JSX, memo } from 'react'
import type { DebouncedState } from 'usehooks-ts'

interface IUnsplashSearch {
  query: string | null
  setQuery: DebouncedState<(value: string) => void>
}

const UnsplashSearch = ({ query, setQuery }: IUnsplashSearch): JSX.Element => {
  return (
    <section className='flex w-[90%] flex-row items-center justify-center gap-2 rounded-lg border-2 border-transparent bg-muted px-2 focus-within:border-primary'>
      <SearchIcon className='text-muted-foreground' />
      <input
        type='text'
        placeholder='Buscar en unsplash'
        className='bg-transparent py-2 text-muted-foreground outline-none placeholder:text-muted-foreground focus:text-primary'
        autoComplete='off'
        defaultValue={query ?? ''}
        onChange={event => setQuery(event.target.value)}
      />
    </section>
  )
}
export default memo(UnsplashSearch)
