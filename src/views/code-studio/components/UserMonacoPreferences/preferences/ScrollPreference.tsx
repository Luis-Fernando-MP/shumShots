import { newKey } from '@/shared/key'
import IconButton from '@/shared/ui/IconButton'
import { editor } from 'monaco-editor'
import { type FC, useState } from 'react'

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
      <h3 className='paragraph-highlight'># Barra de Scroll</h3>

      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        {[true, false].map(state => (
          <IconButton
            key={newKey()}
            onClick={() => {
              handleToggleScrollbar(state)
            }}
            active={enabled === state}
          >
            {state ? 'On' : 'Off'}
          </IconButton>
        ))}
      </div>

      {enabled && (
        <div className='monacoPreferences-subsection flex flex-col border-l-[3px] border-dashed border-primary/50 bg-card/50 px-grid-md py-grid'>
          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Barra vertical</h5>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['auto', 'visible', 'hidden'].map(state => (
                <IconButton
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ vertical: state as any })}
                  active={vertical === state}
                >
                  {state}
                </IconButton>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Barra horizontal</h5>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['auto', 'visible', 'hidden'].map(state => (
                <IconButton
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ horizontal: state as any })}
                  active={horizontal === state}
                >
                  {state}
                </IconButton>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Sombras</h5>
            <span className='paragraph-normal'>Se muestra una sombra en la cabecera del editor.</span>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <IconButton
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ useShadows: state })}
                  active={useShadows === state}
                >
                  {state ? 'On' : 'Off'}
                </IconButton>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Escuchar eventos</h5>
            <span className='paragraph-normal'>
              <i className='paragraph-precaution'>Si se establece en off no se podrá hacer scroll en el editor.</i>
            </span>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <IconButton
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ handleMouseWheel: state })}
                  active={handleMouseWheel === state}
                >
                  {state ? 'On' : 'Off'}
                </IconButton>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Tamaño horizontal</h5>
            <span className='paragraph-normal'>Ajusta el tamaño de la barra horizontal.</span>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[5, 8, 10, 15, 20, 25, 30].map(state => {
                const normal = 10
                const factor = (state / normal).toFixed(1)
                return (
                  <IconButton
                    key={newKey()}
                    onClick={() => handleChangeScrollbar({ horizontalScrollbarSize: state })}
                    active={horizontalScrollbarSize === state}
                  >
                    {state === 10 ? 'Normal' : `x${factor}`}
                  </IconButton>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Tamaño vertical</h5>
            <span className='paragraph-normal'>Ajusta el tamaño de la barra vertical.</span>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[5, 8, 10, 15, 20, 25, 30].map(state => {
                const normal = 10
                const factor = (state / normal).toFixed(1)
                return (
                  <IconButton
                    key={newKey()}
                    onClick={() => handleChangeScrollbar({ verticalScrollbarSize: state })}
                    active={verticalScrollbarSize === state}
                  >
                    {state === 10 ? 'Normal' : `x${factor}`}
                  </IconButton>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <h5 className='paragraph-emphasis'>Ignorar barra horizontal en el contenido</h5>
            <span className='paragraph-normal'>Si está activo, la barra horizontal no aumentará la altura del contenido.</span>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <IconButton
                  key={newKey()}
                  onClick={() => handleChangeScrollbar({ ignoreHorizontalScrollbarInContentHeight: state })}
                  active={ignoreHorizontalScrollbarInContentHeight === state}
                >
                  {state ? 'On' : 'Off'}
                </IconButton>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ScrollPreference
