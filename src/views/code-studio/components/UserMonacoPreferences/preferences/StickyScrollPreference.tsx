import { editor } from 'monaco-editor'
import type { FC } from 'react'

import { PreferenceField, PreferencePanel, PreferenceSection, PreferenceToggle } from '../PreferenceField'

type Monaco = editor.IEditorOptions

interface Props {
  stickyScroll: Monaco['stickyScroll']
  setStickyScroll: (stickyScroll: Monaco['stickyScroll']) => void
}

const StickyScrollPreference: FC<Props> = ({ stickyScroll, setStickyScroll }) => {
  if (!stickyScroll) return null

  const handleChange = (newProps: Partial<Monaco['stickyScroll']>) => {
    setStickyScroll({ ...stickyScroll, ...newProps })
  }

  const { enabled, maxLineCount, defaultModel, scrollWithEditor } = stickyScroll

  return (
    <PreferenceSection
      title='Scroll pegajoso:'
      subtitle='Mantiene el encabezado del bloque visible al hacer scroll.'
    >
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
              onChange={v => handleChange({ defaultModel: v as any })}
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
