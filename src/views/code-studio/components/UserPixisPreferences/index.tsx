'use client'

import Text from '@common/components/Text'
import { PreferenceSearchProvider } from '@views/code-studio/components/preferences/PreferenceField'
import { type FC } from 'react'

import SetterPixisPreferences from './preferences/SetterPixisPreferences'

interface UserPixisPreferencesProps {
  groupId?: 'chrome' | 'pixis'
  query: string
}

/**
 * Preferencias Pixis embebidas en la sidebar (ventana o lienzo).
 *
 * @param props.groupId - Grupo a mostrar. Si se omite, ambos.
 * @param props.query - Texto de búsqueda activo.
 */
const UserPixisPreferences: FC<UserPixisPreferencesProps> = ({ groupId, query }) => {
  const hasQuery = Boolean(query.trim())

  return (
    <div className='min-h-0 flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      <PreferenceSearchProvider query={query}>
        <div className='flex flex-col gap-6 has-[[data-preference-field]]:[&>[data-preference-empty]]:hidden'>
          <SetterPixisPreferences groupId={groupId} />

          {hasQuery && (
            <div
              data-preference-empty
              className='border-border/50 bg-card/30 flex flex-col items-center gap-1 rounded-[12px] border border-dashed px-4 py-8 text-center'
            >
              <Text.emphasis>Sin resultados</Text.emphasis>
              <Text.caption>No hay preferencias que coincidan con “{query.trim()}”.</Text.caption>
            </div>
          )}
        </div>
      </PreferenceSearchProvider>
    </div>
  )
}

export default UserPixisPreferences
