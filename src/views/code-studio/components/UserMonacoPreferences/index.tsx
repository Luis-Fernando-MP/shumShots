'use client'

import SliceContainer from '@common/components/SliceContainer'
import Text from '@common/components/Text'
import {
  matchesPreferenceSearch,
  PreferenceSearchProvider
} from '@views/code-studio/components/preferences/PreferenceField'
import { type FC, type ReactNode } from 'react'

import MonacoLanguages from '../MonacoLanguages'
import ThemeSelectorPreference from './preferences/ThemeSelectorPreference'
import MonacoFonts from './preferences/MonacoFonts'
import SetterMonacoPreferences from './preferences/SetterMonacoPreferences'

const StudioSection = ({
  title,
  subtitle,
  keywords,
  query,
  children
}: {
  title: string
  subtitle: string
  keywords?: string
  query: string
  children: ReactNode
}) => {
  if (!matchesPreferenceSearch(query, [title, subtitle, keywords])) return null

  return (
    <section className='flex flex-col gap-2' data-preference-field>
      <div className='flex flex-col gap-0.5'>
        <Text.heading>{title}</Text.heading>
        <Text.caption>{subtitle}</Text.caption>
      </div>
      {children}
    </section>
  )
}

export type MonacoSidebarTab = 'appearance' | 'editor'

interface UserMonacoPreferencesProps {
  tab: MonacoSidebarTab
  query: string
}

/**
 * Preferencias Monaco embebidas en la sidebar.
 *
 * @param props.tab - Apariencia (temas, lenguajes, fuentes) o editor.
 * @param props.query - Texto de búsqueda activo.
 */
const UserMonacoPreferences: FC<UserMonacoPreferencesProps> = ({ tab, query }) => (
  <div className='min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
    <PreferenceSearchProvider query={query}>
      <div className='flex flex-col gap-6 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
        {tab === 'appearance' && (
          <>
            <StudioSection
              title='Temas'
              subtitle='Paleta de sintaxis del editor.'
              keywords='theme themes sintaxis color esquema'
              query={query}
            >
              <SliceContainer maxHeight={160} extendedMaxHeight={480} className='grid grid-cols-2 gap-1.5'>
                <ThemeSelectorPreference />
              </SliceContainer>
            </StudioSection>
            <StudioSection
              title='Lenguajes'
              subtitle='Icono y modo de resaltado del shot.'
              keywords='language languages lenguaje icono syntax'
              query={query}
            >
              <SliceContainer maxHeight={140} extendedMaxHeight={480}>
                <MonacoLanguages />
              </SliceContainer>
            </StudioSection>
            <StudioSection
              title='Tipografía'
              subtitle='Familia tipográfica del código.'
              keywords='font fonts fuente tipografia mono'
              query={query}
            >
              <SliceContainer maxHeight={160} extendedMaxHeight={520}>
                <MonacoFonts />
              </SliceContainer>
            </StudioSection>
          </>
        )}

        {tab === 'editor' && <SetterMonacoPreferences />}

        {query.trim() && (
          <div
            data-preference-empty
            className='border-border/50 bg-muted/40 flex flex-col items-center gap-1 rounded-[12px] border border-dashed px-4 py-8 text-center'
          >
            <Text.emphasis>Sin resultados</Text.emphasis>
            <Text.caption>No hay preferencias que coincidan con “{query.trim()}”.</Text.caption>
          </div>
        )}
      </div>
    </PreferenceSearchProvider>
  </div>
)

export default UserMonacoPreferences
