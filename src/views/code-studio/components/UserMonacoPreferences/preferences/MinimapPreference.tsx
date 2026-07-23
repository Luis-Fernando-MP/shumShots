import { newKey } from '@/shared/key'
import Button from '@/shared/ui/Button'
import { editor } from 'monaco-editor'
import { type FC } from 'react'
import Typography from '@common/ui/Typography'

type Monaco = editor.IEditorOptions

interface Props {
  minimap: Monaco['minimap']
  setMinimap: (minimap: Monaco['minimap']) => void
}

const MinimapPreference: FC<Props> = ({ minimap, setMinimap }) => {
  if (!minimap) return null

  const handleChangeMinimap = (newProps: Partial<Monaco['minimap']>) => {
    setMinimap({ ...minimap, ...newProps })
  }

  const { enabled, autohide, side, size, showSlider, renderCharacters, maxColumn, scale } = minimap

  return (
    <>
      <Typography.Block title='Minimapa:' />

      <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
        {[true, false].map(state => (
          <Button key={newKey()} onClick={() => handleChangeMinimap({ enabled: state })} active={enabled === state}>
            {state ? 'On' : 'Off'}
          </Button>
        ))}
      </div>

      {minimap?.enabled && (
        <div className='monacoPreferences-subsection flex flex-col border-l-[3px] border-dashed border-primary/50 bg-card/50 px-grid-md py-grid'>
          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Ocultar minimapa</Typography.Emphasis>
            <Typography.Text tone='secondary'>Si está activo, el minimapa se oculta cuando el mouse está sobre el editor.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button key={newKey()} onClick={() => handleChangeMinimap({ autohide: state })} active={autohide === state}>
                  {state ? 'On' : 'Off'}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Posición del minimapa</Typography.Emphasis>
            <Typography.Text tone='secondary'>Muestra el minimapa en el lado izquierdo o derecho del editor.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['left', 'right'].map(state => (
                <Button key={newKey()} onClick={() => handleChangeMinimap({ side: state as any })} active={side === state}>
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Modo de renderizado</Typography.Emphasis>
            <Typography.Text tone='secondary'>
              Proporcional: el minimapa se ajusta al tamaño del editor. Fill: el minimapa ocupa todo el alto del editor.
            </Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['proportional', 'fill'].map(state => (
                <Button key={newKey()} onClick={() => handleChangeMinimap({ size: state as any })} active={size === state}>
                  {state}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Control deslizante</Typography.Emphasis>
            <Typography.Text tone='secondary'>
              Always: muestra el control deslizante en todo momento. Mouseover: muestra el control deslizante solo cuando el mouse
              está sobre el editor.
            </Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {['always', 'mouseover'].map(style => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeMinimap({ showSlider: style as any })}
                  active={showSlider === style}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Representar caracteres</Typography.Emphasis>
            <Typography.Text tone='secondary'>Representa el texto real en una línea (en lugar de bloques de color).</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[true, false].map(state => (
                <Button
                  key={newKey()}
                  onClick={() => handleChangeMinimap({ renderCharacters: state })}
                  active={renderCharacters === state}
                >
                  {state ? 'On' : 'Off'}
                </Button>
              ))}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Columnas máximas</Typography.Emphasis>
            <Typography.Text tone='secondary'>Limita el ancho del minimapa para representar un máximo de columnas.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[50, 75, 100, 125, 150, 175, 200].map(state => {
                const normal = 100
                const factor = (state / normal).toFixed(1)
                return (
                  <Button
                    key={newKey()}
                    onClick={() => handleChangeMinimap({ maxColumn: state })}
                    active={maxColumn === state}
                  >
                    {state == normal ? 'normal' : `x${factor}`}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
            <Typography.Emphasis>Escala</Typography.Emphasis>
            <Typography.Text tone='secondary'>Ajusta el tamaño del minimapa.</Typography.Text>
            <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
              {[1, 2, 3].map(state => {
                const normal = 1
                const factor = (state / normal).toFixed(1)
                return (
                  <Button key={newKey()} onClick={() => handleChangeMinimap({ scale: state })} active={scale === state}>
                    {state == normal ? 'normal' : `x${factor}`}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MinimapPreference
