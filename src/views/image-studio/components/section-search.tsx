'use client'

import { matchesPreferenceSearch } from '@views/code-studio/components/preferences/PreferenceField'
import { createContext, useContext, type ReactNode } from 'react'

const SectionSearchContext = createContext('')

export const SectionSearchProvider = ({ query, children }: { query: string; children: ReactNode }) => (
  <SectionSearchContext.Provider value={query}>{children}</SectionSearchContext.Provider>
)

export const useSectionSearch = (parts: Array<string | undefined>) => {
  const query = useContext(SectionSearchContext)
  return matchesPreferenceSearch(query, parts)
}
