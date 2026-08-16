'use client'

import SliceContainer from '@common/components/SliceContainer'
import Typography from '@common/components/Typography'
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
    <Typography.Block title={title} className='gap-2.5' data-preference-field>
      <Typography.Paragraph tone='secondary' className='m-0 -mt-0.5 leading-snug'>
        {subtitle}
      </Typography.Paragraph>
      {children}
    </Typography.Block>
  )
}

export type MonacoSidebarTab = 'themes' | 'languages' | 'fonts' | 'editor'

const STUDIO_SECTIONS = {
  themes: {
    title: 'Temas:',
    subtitle: 'Paleta de sintaxis del editor.',
    keywords: 'theme themes sintaxis color esquema',
    maxHeight: 112,
    extendedMaxHeight: 480,
    className: 'grid w-full grid-cols-3 flex-row flex-wrap gap-1.5',
    children: <ThemeSelectorPreference />
  },
  languages: {
    title: 'Lenguajes de Programación:',
    subtitle: 'Icono y modo de resaltado del shot.',
    keywords: 'language languages lenguaje icono syntax',
    maxHeight: 140,
    extendedMaxHeight: 480,
    className: 'flex w-full flex-col gap-3',
    children: <MonacoLanguages />
  },
  fonts: {
    title: 'Tipografía:',
    subtitle: 'Familia tipográfica del código.',
    keywords: 'font fonts fuente tipografia mono',
    maxHeight: 160,
    extendedMaxHeight: 520,
    className: 'w-full',
    children: <MonacoFonts />
  }
} as const

interface UserMonacoPreferencesProps {
  tab: MonacoSidebarTab
  query: string
}

/**
 * Preferencias Monaco embebidas en la sidebar.
 *
 * @param props.tab - Sección visible (temas, lenguaje, fuente o editor).
 * @param props.query - Texto de búsqueda activo.
 */
const UserMonacoPreferences: FC<UserMonacoPreferencesProps> = ({ tab, query }) => {
  const section = tab === 'editor' ? null : STUDIO_SECTIONS[tab]

  return (
    <div className='min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      <PreferenceSearchProvider query={query}>
        <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
          {section && (
            <StudioSection
              title={section.title}
              subtitle={section.subtitle}
              keywords={section.keywords}
              query={query}
            >
              <SliceContainer
                maxHeight={section.maxHeight}
                extendedMaxHeight={section.extendedMaxHeight}
                className={section.className}
              >
                {section.children}
              </SliceContainer>
            </StudioSection>
          )}

          {tab === 'editor' && <SetterMonacoPreferences />}

          {query.trim() && (
            <div
              data-preference-empty
              className='border-border/50 bg-card/30 flex flex-col items-center gap-1 rounded-[12px] border border-dashed px-4 py-8 text-center'
            >
              <Typography.Emphasis className='leading-snug'>Sin resultados</Typography.Emphasis>
              <Typography.Paragraph tone='secondary' className='m-0 max-w-[16rem] leading-snug'>
                No hay preferencias que coincidan con “{query.trim()}”.
              </Typography.Paragraph>
            </div>
          )}
        </div>
      </PreferenceSearchProvider>
    </div>
  )
}

export default UserMonacoPreferences
