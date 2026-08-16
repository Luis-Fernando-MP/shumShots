'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import SliceContainer from '@common/components/SliceContainer'
import Typography from '@common/components/Typography'
import {
  matchesPreferenceSearch,
  PreferenceSearchProvider
} from '@views/code-studio/components/preferences/PreferenceField'
import { PreferenceSearch, usePreferenceSearchState } from '@views/code-studio/components/preferences/PreferenceSearch'
import useDiffHistoryStore from '@views/code-studio/store/diffHistory.store'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { Settings } from 'lucide-react'
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

const UserMonacoPreferences: FC = () => {
  const resetMonaco = usePixisPreferencesStore(s => s.resetMonaco)
  const resetDiffHistory = useDiffHistoryStore(s => s.resetDiffHistory)
  const { resetTheme } = useMonacoThemeStore()
  const { query, setQuery } = usePreferenceSearchState()

  const studio = [
    {
      key: 'themes',
      title: 'Temas:',
      subtitle: 'Paleta de sintaxis del editor.',
      keywords: 'theme themes sintaxis color esquema',
      maxHeight: 112,
      extendedMaxHeight: 480,
      className: 'grid w-full grid-cols-3 flex-row flex-wrap gap-1.5',
      children: <ThemeSelectorPreference />
    },
    {
      key: 'languages',
      title: 'Lenguajes de Programación:',
      subtitle: 'Icono y modo de resaltado del shot.',
      keywords: 'language languages lenguaje icono syntax',
      maxHeight: 140,
      extendedMaxHeight: 480,
      className: 'flex w-full flex-col gap-3',
      children: <MonacoLanguages />
    },
    {
      key: 'fonts',
      title: 'Tipografía:',
      subtitle: 'Familia tipográfica del código.',
      keywords: 'font fonts fuente tipografia mono',
      maxHeight: 160,
      extendedMaxHeight: 520,
      className: 'w-full',
      children: <MonacoFonts />
    }
  ] as const

  return (
    <Popup className='h-[min(700px,85dvh)] w-[min(100vw-2rem,420px)]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configurar monaco'>
          <Settings />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Monaco config</Popup.Header>

      <Popup.Content className='scrollbar-hidden flex flex-col gap-5'>
        <PreferenceSearchProvider query={query}>
          <div className='flex flex-col gap-5 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
            {studio.map(section => (
              <StudioSection
                key={section.key}
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
            ))}

            <SetterMonacoPreferences />

            {query.trim() ? (
              <div
                data-preference-empty
                className='border-border/50 bg-card/30 flex flex-col items-center gap-1 rounded-md border border-dashed px-4 py-8 text-center'
              >
                <Typography.Emphasis className='leading-snug'>Sin resultados</Typography.Emphasis>
                <Typography.Paragraph tone='secondary' className='m-0 max-w-[16rem] leading-snug'>
                  No hay preferencias que coincidan con “{query.trim()}”.
                </Typography.Paragraph>
              </div>
            ) : null}
          </div>
        </PreferenceSearchProvider>
      </Popup.Content>

      <Popup.Footer className='flex-col items-stretch gap-2.5'>
        <PreferenceSearch value={query} onChange={setQuery} />
        <Button
          variant='dashed'
          status='primary'
          className='w-full'
          onClick={() => {
            resetMonaco()
            resetTheme()
            resetDiffHistory()
          }}
        >
          Restablecer configuración
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default UserMonacoPreferences
