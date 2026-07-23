import { newKey } from '@/shared/key'
import Button from '@/shared/ui/Button'
import { editor } from 'monaco-editor'
import { type FC, useState } from 'react'
import Typography from '@common/ui/Typography'

type Monaco = editor.IEditorOptions

interface Props {
  scrollbar: Monaco['scrollbar']
  setScrollbar: (scrollbar: Monaco['scrollbar']) => void
}

const ScrollPreference: FC<Props> = ({ scrollbar, setScrollbar }) => {
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

  const handleChangeScrollbar = (newProps: Partial<Monaco['scrollbar']>) => {
    setScrollbar({ ...scrollbar, ...newProps })
  }

  const handleToggleScrollbar = (state: boolean): void => {
    setEnabled(state)
    if (state) return handleChangeScrollbar({ vertical: 'visible', horizontal: 'visible' })

    handleChangeScrollbar({
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
    <>
      <Typography.Block title='Barra de Scroll' />

      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        {[true, false].map(state => (
          <Button
            key={newKey()}
            onClick={() => {
              handleToggleScrollbar(state)
            }}
            active={enabled === state}
          >
            {state ? 'On' : 'Off'}
          </Button>
        ))}
      </div>

      {enabled && (
        <div className='monacoPreferences-subsection flex flex-col border-l-[3px] border-dashed border-primary/50 bg-card/50 px-grid-md py-grid'>
          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Barra vertical</Typography.Emphasis>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['auto', 'visible', 'hidden'].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ vertical: state as any })}
                  active={vertical === state}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Barra horizontal</Typography.Emphasis>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['auto', 'visible', 'hidden'].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ horizontal: state as any })}
                  active={horizontal === state}
                >
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Sombras</Typography.Emphasis>
            <Typography.Text tone='secondary'>Se muestra una sombra en la cabecera del editor.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ useShadows: state })}
                  active={useShadows === state}
                >
                  {state ? 'On' : 'Off'}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Escuchar eventos</Typography.Emphasis>
            <Typography.Text tone='secondary'>
              <Typography.Precaution>Si se establece en off no se podrá hacer scroll en el editor.</Typography.Precaution>
            </Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ handleMouseWheel: state })}
                  active={handleMouseWheel === state}
                >
                  {state ? 'On' : 'Off'}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Tamaño horizontal</Typography.Emphasis>
            <Typography.Text tone='secondary'>Ajusta el tamaño de la barra horizontal.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[5, 8, 10, 15, 20, 25, 30].map(state => {
                const normal = 10
                const factor = (state / normal).toFixed(1)
                return (
                  <Button
                    key={newKey()}
                    onClick={() => handleChangeScrollbar({ horizontalScrollbarSize: state })}
                    active={horizontalScrollbarSize === state}
                  >
                    {state === 10 ? 'Normal' : `x${factor}`}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Tamaño vertical</Typography.Emphasis>
            <Typography.Text tone='secondary'>Ajusta el tamaño de la barra vertical.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[5, 8, 10, 15, 20, 25, 30].map(state => {
                const normal = 10
                const factor = (state / normal).toFixed(1)
                return (
                  <Button
                    key={newKey()}
                    onClick={() => handleChangeScrollbar({ verticalScrollbarSize: state })}
                    active={verticalScrollbarSize === state}
                  >
                    {state === 10 ? 'Normal' : `x${factor}`}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Ignorar barra horizontal en el contenido</Typography.Emphasis>
            <Typography.Text tone='secondary'>Si está activo, la barra horizontal no aumentará la altura del contenido.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ ignoreHorizontalScrollbarInContentHeight: state })}
                  active={ignoreHorizontalScrollbarInContentHeight === state}
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

export default ScrollPreference
