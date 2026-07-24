import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import { type FC, useState } from 'react'

import { PreferenceField, PreferencePanel, PreferenceSection, PreferenceToggle } from '@views/code-studio/components/preferences/PreferenceField'

const ScrollPreference: FC = () => {
  const group = getGroup('scrollbar')
  const scrollbar = usePixisPreferencesStore(s => s.monaco.scrollbar)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)
  const [enabled, setEnabled] = useState(false)

  if (!scrollbar) return null

  const {
    vertical,
    horizontal,
    useShadows,
    handleMouseWheel,
    horizontalScrollbarSize,
    verticalScrollbarSize,
    ignoreHorizontalScrollbarInContentHeight
  } = scrollbar

  const handleChange = (newProps: Partial<NonNullable<typeof scrollbar>>) => {
    setMonaco('scrollbar', { ...scrollbar, ...newProps })
  }

  const handleToggle = (state: boolean): void => {
    setEnabled(state)
    if (state) return handleChange({ vertical: 'visible', horizontal: 'visible' })

    handleChange({
      vertical: 'hidden',
      horizontal: 'hidden',
      useShadows: false,
      handleMouseWheel: true,
      horizontalScrollbarSize: 10,
      verticalScrollbarSize: 10,
      ignoreHorizontalScrollbarInContentHeight: false
    })
  }

  return (
    <PreferenceSection title={group.title} subtitle={group.subtitle}>
      <PreferenceField title='Activar' subtitle='Mostrar barras personalizadas'>
        <PreferenceToggle value={enabled} options={[true, false] as const} onChange={handleToggle} />
      </PreferenceField>

      {enabled && (
        <PreferencePanel>
          <PreferenceField title='Vertical' subtitle='Barra de la derecha' example='Ej: auto = solo si hace falta'>
            <PreferenceToggle
              value={vertical ?? 'auto'}
              options={['auto', 'visible', 'hidden'] as const}
              onChange={v => handleChange({ vertical: v as 'auto' | 'visible' | 'hidden' })}
            />
          </PreferenceField>

          <PreferenceField title='Horizontal' subtitle='Barra inferior' example='Ej: visible = siempre a la vista'>
            <PreferenceToggle
              value={horizontal ?? 'auto'}
              options={['auto', 'visible', 'hidden'] as const}
              onChange={v => handleChange({ horizontal: v as 'auto' | 'visible' | 'hidden' })}
            />
          </PreferenceField>

          <PreferenceField
            title='Sombras'
            subtitle='Sombra al hacer scroll'
            description='Indica que hay contenido fuera de vista.'
          >
            <PreferenceToggle
              value={useShadows ?? false}
              options={[true, false] as const}
              onChange={v => handleChange({ useShadows: v })}
            />
          </PreferenceField>

          <PreferenceField title='Rueda del mouse' subtitle='Scroll con wheel' note='Off bloquea el scroll con la rueda.'>
            <PreferenceToggle
              value={handleMouseWheel ?? true}
              options={[true, false] as const}
              onChange={v => handleChange({ handleMouseWheel: v })}
            />
          </PreferenceField>

          <PreferenceField title='Grosor horizontal' subtitle='Alto de la barra inferior' example='Ej: Normal = 10px'>
            <PreferenceToggle
              value={horizontalScrollbarSize ?? 10}
              options={[5, 8, 10, 15, 20, 25, 30] as const}
              onChange={v => handleChange({ horizontalScrollbarSize: v })}
              normal={10}
              label={v => (v === 10 ? 'Normal' : `x${(v / 10).toFixed(1)}`)}
            />
          </PreferenceField>

          <PreferenceField title='Grosor vertical' subtitle='Ancho de la barra derecha' example='Ej: Normal = 10px'>
            <PreferenceToggle
              value={verticalScrollbarSize ?? 10}
              options={[5, 8, 10, 15, 20, 25, 30] as const}
              onChange={v => handleChange({ verticalScrollbarSize: v })}
              normal={10}
              label={v => (v === 10 ? 'Normal' : `x${(v / 10).toFixed(1)}`)}
            />
          </PreferenceField>

          <PreferenceField
            title='Ignorar altura horizontal'
            subtitle='No sumar la barra al layout'
            description='Evita que la barra inferior agrande el alto del contenido.'
          >
            <PreferenceToggle
              value={ignoreHorizontalScrollbarInContentHeight ?? false}
              options={[true, false] as const}
              onChange={v => handleChange({ ignoreHorizontalScrollbarInContentHeight: v })}
            />
          </PreferenceField>
        </PreferencePanel>
      )}
    </PreferenceSection>
  )
}

export default ScrollPreference
