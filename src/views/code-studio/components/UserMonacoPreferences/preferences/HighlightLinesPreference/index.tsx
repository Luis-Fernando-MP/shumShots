'use client'

import Button from '@/shared/ui/Button'
import { Input } from '@common/components/Input'
import {
  PreferenceField,
  PreferencePanel,
  PreferenceSection,
  PreferenceToggle,
  usePreferenceSearch
} from '@views/code-studio/components/preferences/PreferenceField'
import useDiffHistoryStore from '@views/code-studio/store/diffHistory.store'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore, { selectActiveFile } from '@views/code-studio/store/workspace.store'
import {
  getGroup,
  type HighlightLinesDiffView,
  type HighlightLinesStyle
} from '@views/code-studio/utils/preferences'
import { type FC } from 'react'

const STYLE_OPTIONS: readonly HighlightLinesStyle[] = ['amber', 'blue', 'green', 'pink', 'purple']
const DIFF_VIEW_OPTIONS: readonly HighlightLinesDiffView[] = ['off', 'sideBySide', 'inline']

const STYLE_LABEL: Record<HighlightLinesStyle, string> = {
  amber: 'Amber',
  blue: 'Blue',
  green: 'Green',
  pink: 'Pink',
  purple: 'Purple'
}

const DIFF_VIEW_LABEL: Record<HighlightLinesDiffView, string> = {
  off: 'Off',
  sideBySide: 'Paralelo',
  inline: 'Inline'
}

const HighlightLinesPreference: FC = () => {
  const group = getGroup('highlightLines')
  const highlightLines = usePixisPreferencesStore(s => s.monaco.highlightLines)
  const setMonaco = usePixisPreferencesStore(s => s.setMonaco)
  const activeFile = useWorkspaceStore(selectActiveFile)
  const activeFileId = useWorkspaceStore(s => s.activeFileId)
  const setOriginal = useDiffHistoryStore(s => s.setOriginal)
  const ensureOriginal = useDiffHistoryStore(s => s.ensureOriginal)
  const diffOriginal = useDiffHistoryStore(s =>
    activeFileId ? s.byFileId[activeFileId]?.original : undefined
  )
  const query = usePreferenceSearch()
  const searching = query.trim().length > 0

  const handleChange = (patch: Partial<typeof highlightLines>) => {
    setMonaco('highlightLines', { ...highlightLines, ...patch })
  }

  const activeContent = activeFile?.kind === 'file' ? (activeFile.content ?? '') : ''
  const { enabled, ranges, showGutterBar, style, overviewRuler, diffView, showWhitespace } =
    highlightLines
  const diffActive = diffView !== 'off'
  const showDiffPanel = diffActive || searching
  const showRangesPanel = (enabled && !diffActive) || searching

  const snapshotOriginal = () => {
    if (!activeFileId) return
    setOriginal(activeFileId, activeContent)
  }

  const setDiffView = (next: HighlightLinesDiffView) => {
    if (next !== 'off' && diffView === 'off' && activeFileId) {
      ensureOriginal(activeFileId, activeContent)
    }
    handleChange({ diffView: next })
  }

  const originalDescription =
    (diffOriginal != null &&
      `Original de este tab: ${diffOriginal.split('\n').length} líneas. Edita solo el lado actual.`) ||
    'Sin snapshot aún para este tab.'

  return (
    <PreferenceSection
      title={group.title}
      subtitle={group.subtitle}
      keywords='highlight lines resaltar rango diff editor paralelo inline gutter'
    >
      <PreferenceField
        title='Diff Editor'
        subtitle='Pasado (izq.) vs actual (der.)'
        description='Cada tab guarda su pasado (solo lectura). Edita el actual para ver rojo/verde.'
        example='Ej: Paralelo = dos columnas; Inline = estilo git'
        keywords='diff sideBySide inline createDiffEditor'
      >
        <PreferenceToggle
          value={diffView}
          options={DIFF_VIEW_OPTIONS}
          onChange={setDiffView}
          label={v => DIFF_VIEW_LABEL[v]}
        />
      </PreferenceField>

      {showDiffPanel && (
        <PreferencePanel>
          <PreferenceField
            title='Reiniciar pasado'
            subtitle='Vuelve a capturar este tab como original'
            description={originalDescription}
            keywords='original snapshot reiniciar'
          >
            <Button type='button' size='sm' variant='outline' onClick={snapshotOriginal}>
              Capturar tab actual como pasado
            </Button>
          </PreferenceField>

          <PreferenceField
            title='Espacios en Diff'
            subtitle='Alinea y marca diferencias de whitespace'
            description='On = respeta espacios/tabs al comparar. Off = ignora solo whitespace.'
            keywords='whitespace spaces espacios tabs alineacion ignoreTrimWhitespace'
          >
            <PreferenceToggle
              value={showWhitespace}
              options={[true, false] as const}
              onChange={v => handleChange({ showWhitespace: v })}
            />
          </PreferenceField>
        </PreferencePanel>
      )}

      <PreferenceField
        title='Resaltar rangos'
        subtitle='Decoraciones en el editor normal'
        description='Solo aplica cuando Diff Editor está Off.'
        keywords='enabled enable highlight ranges'
      >
        <PreferenceToggle
          value={enabled}
          options={[true, false] as const}
          onChange={v => handleChange({ enabled: v })}
        />
      </PreferenceField>

      {showRangesPanel && (
        <PreferencePanel>
          <PreferenceField
            title='Rangos'
            subtitle='Líneas o intervalos a resaltar'
            description='Usa comas para varios: una línea (20) o un rango (11-13).'
            example='Ej: 11-13, 20, 25-27'
            keywords='ranges lines lineas'
          >
            <Input
              type='text'
              size='sm'
              variant='outline'
              value={ranges}
              placeholder='11-13, 20'
              spellCheck={false}
              autoComplete='off'
              aria-label='Rangos de líneas'
              onChange={e => handleChange({ ranges: e.target.value })}
              containerClassName='w-full min-w-[12rem]'
            />
          </PreferenceField>

          <PreferenceField
            title='Barra lateral'
            subtitle='Marca continua junto al número'
            example='Ej: On = franja sólida a la izquierda del número'
            keywords='gutter bar barra'
          >
            <PreferenceToggle
              value={showGutterBar}
              options={[true, false] as const}
              onChange={v => handleChange({ showGutterBar: v })}
            />
          </PreferenceField>

          <PreferenceField
            title='Color'
            subtitle='Tinte del fondo resaltado'
            keywords='style color amber blue'
          >
            <PreferenceToggle
              value={style}
              options={STYLE_OPTIONS}
              onChange={v => handleChange({ style: v })}
              label={v => STYLE_LABEL[v]}
            />
          </PreferenceField>

          <PreferenceField
            title='Overview ruler'
            subtitle='Marca en la barra derecha'
            keywords='overview ruler'
          >
            <PreferenceToggle
              value={overviewRuler}
              options={[true, false] as const}
              onChange={v => handleChange({ overviewRuler: v })}
            />
          </PreferenceField>
        </PreferencePanel>
      )}
    </PreferenceSection>
  )
}

export default HighlightLinesPreference
