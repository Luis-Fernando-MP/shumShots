import { Input } from '@common/ui/Input'
import Button from '@/shared/ui/Button'
import useMonacoStore from '@views/code-studio/store/monaco.store'
import useMonacoThemeStore from '@views/code-studio/store/monacoTheme.store'
import useShumOptionsStore from '@views/code-studio/store/shumOptions.store'
import { type FC, useMemo } from 'react'

import { PreferenceField, PreferenceSection, PreferenceToggle } from './PreferenceField'
import FontSizePreference from './preferences/FontSizePreference'
import MinimapPreference from './preferences/MinimapPreference'
import ScrollPreference from './preferences/ScrollPreference'
import ShumShotsPreferences from './preferences/ShumShotsPreferences'
import StickyScrollPreference from './preferences/StickyScrollPreference'

const SetterMonacoPreferences: FC = () => {
  const monaco = useMonacoStore()
  const { resetShumPreferences } = useShumOptionsStore()
  const { resetTheme } = useMonacoThemeStore()

  const $editor = useMemo(() => document.querySelector('#monacoEditor') as HTMLElement, [])
  const $editorContainer = useMemo(() => document.querySelector('#monacoEditor-container') as HTMLElement, [])

  const handleResetPreferences = () => {
    monaco.resetPreferences()
    resetShumPreferences()
    resetTheme()
    if (!$editor || !$editorContainer) return
    $editor.style.borderRadius = '20px'
    $editor.style.height = '600px'
    $editor.style.width = '900px'
    $editorContainer.style.borderRadius = '20px'
    $editorContainer.style.padding = '10px'
  }

  return (
    <>
      <Button variant='dashed' status='primary' className='w-full' onClick={handleResetPreferences}>
        Restablecer configuración
      </Button>

      <ShumShotsPreferences />

      <PreferenceSection title='Visual:' subtitle='Aspecto del editor: márgenes, wrap y resaltados.'>
        <PreferenceField
          title='Margen de glyph'
          subtitle='Columna izquierda para iconos'
          description='Espacio para breakpoints, errores y otras marcas.'
        >
          <PreferenceToggle
            value={monaco.glyphMargin ?? false}
            options={[true, false] as const}
            onChange={v => monaco.setGlyphMargin(v)}
          />
        </PreferenceField>

        <PreferenceField
          title='Validación de código'
          subtitle='Subrayado de errores'
          description='Muestra avisos de sintaxis que Monaco detecte.'
          note='Solo lenguajes con soporte de validación.'
        >
          <PreferenceToggle
            value={monaco.renderValidationDecorations ?? 'editable'}
            options={['editable', 'on', 'off'] as const}
            onChange={v => monaco.setRenderValidationDecorations(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Números de línea'
          subtitle='Cómo se numeran las filas'
          example='Ej: relative = distancia al cursor (1, 2, 3...)'
        >
          <PreferenceToggle
            value={(monaco.lineNumbers ?? 'on') as string}
            options={['on', 'off', 'relative', 'interval'] as const}
            onChange={v => monaco.setLineNumbers(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Salto de línea'
          subtitle='Wrap del texto largo'
          example='Ej: on = siempre; wordWrapColumn = al llegar a la columna'
        >
          <PreferenceToggle
            value={monaco.wordWrap ?? 'off'}
            options={['on', 'off', 'wordWrapColumn', 'bounded'] as const}
            onChange={v => monaco.setWordWrap(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Columna de salto'
          subtitle='Ancho máximo antes del wrap'
          example='Ej: 80 ≈ ancho clásico de terminal'
          note='Solo aplica con wordWrapColumn o bounded.'
        >
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={monaco.wordWrapColumn ?? 80}
            min={10}
            max={200}
            step={10}
            onChange={e => monaco.setWordWrapColumn(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={monaco.wordWrapColumn ?? 80}
            options={[50, 60, 70, 80, 90, 100, 110, 120] as const}
            onChange={v => monaco.setWordWrapColumn(v)}
            normal={80}
          />
        </PreferenceField>

        <PreferenceField
          title='Sangría al saltar'
          subtitle='Indent de las líneas wrappeadas'
          example='Ej: indent = respeta el nivel; deepIndent = un nivel más'
          note='Requiere salto de línea activo.'
        >
          <PreferenceToggle
            value={monaco.wrappingIndent ?? 'none'}
            options={['none', 'indent', 'deepIndent'] as const}
            onChange={v => monaco.setWrappingIndent(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Resaltado de línea'
          subtitle='Marca dónde está el cursor'
          example='Ej: gutter = solo el margen; full = fila completa'
          note='La intensidad depende del tema.'
        >
          <PreferenceToggle
            value={monaco.renderLineHighlight ?? 'line'}
            options={['none', 'gutter', 'line', 'full'] as const}
            onChange={v => monaco.setRenderLineHighlight(v as any)}
          />
        </PreferenceField>
      </PreferenceSection>

      <PreferenceSection title='Tipografía:' subtitle='Tamaño, ritmo y detalle tipográfico del código.'>
        <FontSizePreference fontSize={monaco.fontSize} setFontSize={monaco.setFontSize} />

        <PreferenceField
          title='Espaciado entre letras'
          subtitle='Tracking del texto'
          example='Ej: 0 = normal; valores altos abren el código'
        >
          <PreferenceToggle
            value={monaco.letterSpacing ?? 0}
            options={[-1, -0.5, 0, 0.5, 1, 2, 3] as const}
            onChange={v => monaco.setLetterSpacing(v)}
            normal={0}
          />
        </PreferenceField>

        <PreferenceField
          title='Ligaduras'
          subtitle='Une operadores en un solo glifo'
          example='Ej: => !== >= se ven como un símbolo'
          note='Depende de la tipografía elegida.'
        >
          <PreferenceToggle
            value={typeof monaco.fontLigatures === 'boolean' ? monaco.fontLigatures : false}
            options={[true, false] as const}
            onChange={v => monaco.setFontLigatures(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Altura entre líneas'
          subtitle='Line-height del editor'
          example='Ej: Normal = 22px'
        >
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={monaco.lineHeight ?? 22}
            min={8}
            max={32}
            step={2}
            onChange={e => monaco.setLineHeight(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={monaco.lineHeight ?? 22}
            options={[18, 20, 22, 24, 26, 28] as const}
            onChange={v => monaco.setLineHeight(v)}
            normal={22}
            label={v => {
              if (v === 22) return 'Normal'
              return `x${(v / 22).toFixed(1)}`
            }}
          />
        </PreferenceField>
      </PreferenceSection>

      <MinimapPreference minimap={monaco.minimap} setMinimap={monaco.setMinimap} />
      <ScrollPreference scrollbar={monaco.scrollbar} setScrollbar={monaco.setScrollbar} />
      <StickyScrollPreference stickyScroll={monaco.stickyScroll} setStickyScroll={monaco.setStickyScroll} />

      <PreferenceSection title='Cursor:' subtitle='Forma, parpadeo y comportamiento del caret.'>
        <PreferenceField
          title='Parpadeo'
          subtitle='Animación del cursor'
          example='Ej: solid = sin parpadear; smooth = fundido'
        >
          <PreferenceToggle
            value={monaco.cursorBlinking ?? 'blink'}
            options={['blink', 'smooth', 'phase', 'expand', 'solid'] as const}
            onChange={v => monaco.setCursorBlinking(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Estilo'
          subtitle='Forma visual del caret'
          example='Ej: block = caja; line-thin = barra fina'
        >
          <PreferenceToggle
            value={monaco.cursorStyle ?? 'line'}
            options={['block', 'block-outline', 'underline', 'underline-thin', 'line', 'line-thin'] as const}
            onChange={v => monaco.setCursorStyle(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Cursor del mouse'
          subtitle='Pointer al pasar sobre el editor'
          example='Ej: text = I-beam; copy = indicador de copiar'
        >
          <PreferenceToggle
            value={monaco.mouseStyle ?? 'default'}
            options={['default', 'copy', 'text'] as const}
            onChange={v => monaco.setMouseStyle(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Ruler de overview'
          subtitle='Cursor en la barra derecha'
          description='Si está On, oculta el caret en el overview ruler.'
        >
          <PreferenceToggle
            value={monaco.hideCursorInOverviewRuler ?? false}
            options={[true, false] as const}
            onChange={v => monaco.setHideCursorInOverviewRuler(v)}
          />
        </PreferenceField>
      </PreferenceSection>

      <PreferenceSection title='Editor:' subtitle='Comportamiento al editar, plegar y auto-cerrar.'>
        <PreferenceField
          title='Plegado de código'
          subtitle='Fold de bloques'
          description='Permite colapsar funciones, clases y regiones.'
        >
          <PreferenceToggle
            value={monaco.folding ?? true}
            options={[true, false] as const}
            onChange={v => monaco.setFolding(v)}
          />
        </PreferenceField>

        <PreferenceField
          title='Scroll extra'
          subtitle='Espacio bajo la última línea'
          description='Deja margen vacío al final para bajar el foco.'
        >
          <PreferenceToggle
            value={monaco.scrollBeyondLastLine ?? true}
            options={[true, false] as const}
            onChange={v => monaco.setScrollBeyondLastLine(v)}
          />
        </PreferenceField>

        <PreferenceField
          title='Formatear al pegar'
          subtitle='Auto-format on paste'
          example='Ej: pegas un bloque y se indenta solo'
        >
          <PreferenceToggle
            value={monaco.formatOnPaste ?? false}
            options={[true, false] as const}
            onChange={v => monaco.setFormatOnPaste(v)}
          />
        </PreferenceField>

        <PreferenceField
          title='Formatear al escribir'
          subtitle='Auto-format on type'
          example='Ej: al cerrar } se reordena el bloque'
        >
          <PreferenceToggle
            value={monaco.formatOnType ?? false}
            options={[true, false] as const}
            onChange={v => monaco.setFormatOnType(v)}
          />
        </PreferenceField>

        <PreferenceField
          title='Match de paréntesis'
          subtitle='Resalta el cierre emparejado'
          example='Ej: near = solo si está cerca; always = siempre'
        >
          <PreferenceToggle
            value={monaco.matchBrackets ?? 'always'}
            options={['never', 'near', 'always'] as const}
            onChange={v => monaco.setMatchBrackets(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Auto-cierre de brackets'
          subtitle='(), [], {} al escribir'
          example='Ej: escribes ( y aparece )'
        >
          <PreferenceToggle
            value={monaco.autoClosingBrackets ?? 'languageDefined'}
            options={['always', 'beforeWhitespace', 'languageDefined', 'never'] as const}
            onChange={v => monaco.setAutoClosingBrackets(v as any)}
          />
        </PreferenceField>

        <PreferenceField
          title='Auto-cierre de comillas'
          subtitle={`" " y ' ' al escribir`}
          example='Ej: languageDefined = según el lenguaje'
        >
          <PreferenceToggle
            value={monaco.autoClosingQuotes ?? 'languageDefined'}
            options={['always', 'beforeWhitespace', 'languageDefined', 'never'] as const}
            onChange={v => monaco.setAutoClosingQuotes(v as any)}
          />
        </PreferenceField>
      </PreferenceSection>
    </>
  )
}

export default SetterMonacoPreferences
