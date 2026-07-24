import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import type { FC } from 'react'

import { PreferenceField, PreferencePanel, PreferenceSection, PreferenceToggle } from '@views/code-studio/components/preferences/PreferenceField'

const StickyScrollPreference: FC = () => {
  const group = getGroup('stickyScroll')
  const stickyScroll = usePixisPreferencesStore(s => s.monaco.stickyScroll)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)

  if (!stickyScroll) return null

  const handleChange = (newProps: Partial<NonNullable<typeof stickyScroll>>) => {
    setMonaco('stickyScroll', { ...stickyScroll, ...newProps })
  }

  const { enabled, maxLineCount, defaultModel, scrollWithEditor } = stickyScroll

  return (
    <PreferenceSection title={group.title} subtitle={group.subtitle}>
      <PreferenceField title='Activar' subtitle='Fijar contexto arriba del editor'>
        <PreferenceToggle
          value={enabled ?? false}
          options={[true, false] as const}
          onChange={v => handleChange({ enabled: v })}
        />
      </PreferenceField>

      {enabled && (
        <PreferencePanel>
          <PreferenceField
            title='Máximo de líneas'
            subtitle='Cuántas filas sticky se apilan'
            example='Ej: Normal = 5 niveles'
          >
            <PreferenceToggle
              value={maxLineCount ?? 5}
              options={[1, 2, 3, 5, 7, 8, 9] as const}
              onChange={v => handleChange({ maxLineCount: v })}
              normal={5}
            />
          </PreferenceField>

          <PreferenceField
            title='Modelo'
            subtitle='Qué estructura usa para fijar'
            example='Ej: outlineModel = clases/funciones; indentationModel = por tabs'
          >
            <PreferenceToggle
              value={defaultModel ?? 'outlineModel'}
              options={['outlineModel', 'foldingProviderModel', 'indentationModel'] as const}
              onChange={v =>
                handleChange({
                  defaultModel: v as 'outlineModel' | 'foldingProviderModel' | 'indentationModel'
                })
              }
              label={v => {
                if (v === 'outlineModel') return 'outline'
                if (v === 'foldingProviderModel') return 'folding'
                return 'indent'
              }}
            />
          </PreferenceField>

          <PreferenceField
            title='Seguir scroll horizontal'
            subtitle='Se mueve con el pan lateral'
            note='Requiere barra horizontal activa.'
          >
            <PreferenceToggle
              value={scrollWithEditor ?? true}
              options={[true, false] as const}
              onChange={v => handleChange({ scrollWithEditor: v })}
            />
          </PreferenceField>
        </PreferencePanel>
      )}
    </PreferenceSection>
  )
}

export default StickyScrollPreference
