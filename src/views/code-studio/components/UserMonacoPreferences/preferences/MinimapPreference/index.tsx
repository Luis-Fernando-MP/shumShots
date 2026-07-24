import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import { getGroup } from '@views/code-studio/utils/preferences.config'
import { type FC } from 'react'

import { PreferenceField, PreferencePanel, PreferenceSection, PreferenceToggle } from '@views/code-studio/components/preferences/PreferenceField'

const MinimapPreference: FC = () => {
  const group = getGroup('minimap')
  const minimap = usePixisPreferencesStore(s => s.monaco.minimap)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)

  if (!minimap) return null

  const handleChange = (newProps: Partial<NonNullable<typeof minimap>>) => {
    setMonaco('minimap', { ...minimap, ...newProps })
  }

  const { enabled, autohide, side, size, showSlider, renderCharacters, maxColumn, scale } = minimap

  return (
    <PreferenceSection title={group.title} subtitle={group.subtitle}>
      <PreferenceField title='Activar' subtitle='Mostrar u ocultar el minimapa'>
        <PreferenceToggle
          value={enabled ?? false}
          options={[true, false] as const}
          onChange={v => handleChange({ enabled: v })}
        />
      </PreferenceField>

      {minimap.enabled && (
        <PreferencePanel>
          <PreferenceField
            title='Auto-ocultar'
            subtitle='Se esconde al pasar el mouse'
            description='Útil si quieres más espacio al editar.'
          >
            <PreferenceToggle
              value={autohide ?? false}
              options={[true, false] as const}
              onChange={v => handleChange({ autohide: v })}
            />
          </PreferenceField>

          <PreferenceField title='Posición' subtitle='Lado del editor' example='Ej: right = clásico de VS Code'>
            <PreferenceToggle
              value={side ?? 'right'}
              options={['left', 'right'] as const}
              onChange={v => handleChange({ side: v as 'left' | 'right' })}
            />
          </PreferenceField>

          <PreferenceField
            title='Modo'
            subtitle='Cómo escala el minimapa'
            example='Ej: fill = ocupa todo el alto; proportional = escala con el doc'
          >
            <PreferenceToggle
              value={size ?? 'proportional'}
              options={['proportional', 'fill'] as const}
              onChange={v => handleChange({ size: v as 'proportional' | 'fill' })}
            />
          </PreferenceField>

          <PreferenceField
            title='Slider'
            subtitle='Cuándo se ve el control'
            example='Ej: mouseover = solo al pasar el mouse'
          >
            <PreferenceToggle
              value={showSlider ?? 'always'}
              options={['always', 'mouseover'] as const}
              onChange={v => handleChange({ showSlider: v as 'always' | 'mouseover' })}
            />
          </PreferenceField>

          <PreferenceField
            title='Caracteres reales'
            subtitle='Texto vs bloques de color'
            description='On dibuja letras; Off usa solo color por token.'
          >
            <PreferenceToggle
              value={renderCharacters ?? true}
              options={[true, false] as const}
              onChange={v => handleChange({ renderCharacters: v })}
            />
          </PreferenceField>

          <PreferenceField title='Columnas máximas' subtitle='Ancho del mapa' example='Ej: Normal = 100 columnas'>
            <PreferenceToggle
              value={maxColumn ?? 100}
              options={[50, 75, 100, 125, 150, 175, 200] as const}
              onChange={v => handleChange({ maxColumn: v })}
              normal={100}
              label={v => (v === 100 ? 'Normal' : `x${(v / 100).toFixed(1)}`)}
            />
          </PreferenceField>

          <PreferenceField title='Escala' subtitle='Zoom del minimapa' example='Ej: x2 = el doble de grande'>
            <PreferenceToggle
              value={scale ?? 1}
              options={[1, 2, 3] as const}
              onChange={v => handleChange({ scale: v })}
              normal={1}
              label={v => (v === 1 ? 'Normal' : `x${v}`)}
            />
          </PreferenceField>
        </PreferencePanel>
      )}
    </PreferenceSection>
  )
}

export default MinimapPreference
