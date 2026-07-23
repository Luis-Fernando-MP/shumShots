import { newKey } from '@/shared/key'
import Button from '@/shared/ui/Button'
import { editor } from 'monaco-editor'
import type { FC } from 'react'
import Typography from '@common/ui/Typography'

type Monaco = editor.IEditorOptions

interface Props {
  stickyScroll: Monaco['stickyScroll']
  setStickyScroll: (stickyScroll: Monaco['stickyScroll']) => void
}

const StickyScrollPreference: FC<Props> = ({ stickyScroll, setStickyScroll }) => {
  if (!stickyScroll) return null

  const handleChangeStickyScroll = (newProps: Partial<Monaco['stickyScroll']>) => {
    setStickyScroll({ ...stickyScroll, ...newProps })
  }

  const { enabled, maxLineCount, defaultModel, scrollWithEditor } = stickyScroll

  return (
    <>
      <Typography.Block title='Scroll pegajoso:' />

      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        {[true, false].map(state => (
          <Button key={newKey()} onClick={() => handleChangeStickyScroll({ enabled: state })} active={enabled === state}>
            {state ? 'On' : 'Off'}
          </Button>
        ))}
      </div>

      {enabled && (
        <div className='monacoPreferences-subsection flex flex-col border-l-[3px] border-dashed border-primary/50 bg-card/50 px-grid-md py-grid'>
          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Máximo de líneas</Typography.Emphasis>
            <Typography.Text tone='secondary'>Máximo de líneas que se mostrarán en el scroll pegajoso.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[1, 2, 3, 5, 7, 8, 9].map(state => {
                const normal = 5
                return (
                  <Button
                    key={newKey()}
                    onClick={() => handleChangeStickyScroll({ maxLineCount: state })}
                    active={maxLineCount === state}
                  >
                    {state === normal ? 'Normal' : state}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Modelo</Typography.Emphasis>
            <Typography.Text tone='secondary'>
              - outlineModel: Muestra la estructura general (clases, funciones, variables).
              <br />
              <br /> - foldingProviderModel: Usa la información de plegado para las secciones.
              <br />
              <br /> - indentationModel: Utiliza la indentación para guiar en la estructura visual.
            </Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['outlineModel', 'foldingProviderModel', 'indentationModel'].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeStickyScroll({ defaultModel: state as any })}
                  active={defaultModel === state}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Desplazamiento con el editor</Typography.Emphasis>
            <Typography.Text tone='secondary'>
              El scroll pegajoso se moverá cuando se desplace el editor horizontalmente.{' '}
              <Typography.Precaution>Requiere que el scroll horizontal esté activo.</Typography.Precaution>
            </Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeStickyScroll({ scrollWithEditor: state })}
                  active={scrollWithEditor === state}
                >
                  {state ? 'On' : 'Off'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StickyScrollPreference
