import useShumOptionsStore from '@views/code-studio/store/shumOptions.store'
import { newKey } from '@/shared/key'
import IconButton from '@/shared/ui/IconButton'
import LabeledInput from '@/shared/ui/LabeledInput'
import { type FC, useMemo } from 'react'

const ShumShotsPreferences: FC = () => {
  const shots = useShumOptionsStore()
  const $editor = useMemo(() => document.querySelector('#monacoEditor') as HTMLElement, [])
  const $editorContainer = useMemo(() => document.querySelector('#monacoEditor-container') as HTMLElement, [])

  const handleChangeBorderRadius = (style: number): void => {
    if (!$editor) return
    $editor.style.borderRadius = `${style}px`
    shots.setBorderRadius(style)
  }

  const handleChangeHeight = (style: number): void => {
    if (!$editor) return
    $editor.style.height = `${style}px`
    shots.setContainerHeight(style)
  }

  const handleChangeWidth = (style: number): void => {
    if (!$editor) return
    $editor.style.width = `${style}px`
    shots.setContainerWidth(style)
  }

  const handleChangeContainerBorderRadius = (style: number): void => {
    if (!$editorContainer) return
    $editorContainer.style.borderRadius = `${style}px`
    shots.setContainerBorderRadius(style)
  }

  const handleChangePadding = (style: number): void => {
    if (!$editorContainer) return
    $editorContainer.style.padding = `${style}px`
    shots.setContainerPadding(style)
  }

  return (
    <div className='monacoPreferences-subsection flex flex-col border-l-[3px] border-dashed border-primary/50 bg-card/50 px-grid-md py-grid'>
      <div className='paragraph'>
        <h3 className='paragraph-highlight'># Shum shot's:</h3>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Mostrar icono del lenguaje</h5>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[true, false].map(style => (
            <IconButton key={newKey()} onClick={() => shots.setShowLanguageIcon(style)} active={shots.showLanguageIcon === style}>
              {style ? 'On' : 'Off'}
            </IconButton>
          ))}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Sombrear icono del lenguaje</h5>
        <p className='paragraph-normal'>
          Util para aquellos iconos blancos o muy transparentes.{' '}
          <i className='paragraph-precaution'>Requiere que se muestre el icono del lenguaje</i>
        </p>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[true, false].map(style => (
            <IconButton key={newKey()} onClick={() => shots.setShadowLanguage(style)} active={shots.shadowLanguage === style}>
              {style ? 'On' : 'Off'}
            </IconButton>
          ))}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Redondeado del editor</h5>
        <p className='paragraph-normal'>
          Util para aquellos iconos blancos o muy transparentes.{' '}
          <i className='paragraph-precaution'>Requiere que se muestre el icono del lenguaje</i>
        </p>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          <LabeledInput
            type='number'
            value={shots.borderRadius}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangeBorderRadius(Number(e.target.value))}
          >
            px
          </LabeledInput>
        </div>

        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40].map(style => {
            const normal = 20
            return (
              <IconButton key={newKey()} onClick={() => handleChangeBorderRadius(style)} active={shots.borderRadius === style}>
                {style === normal ? 'Normal' : style}
              </IconButton>
            )
          })}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Redondeado del contenedor</h5>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          <LabeledInput
            type='number'
            value={shots.containerBorderRadius}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangeContainerBorderRadius(Number(e.target.value))}
          >
            px
          </LabeledInput>
        </div>

        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40].map(style => {
            const normal = 20
            return (
              <IconButton
                key={newKey()}
                onClick={() => handleChangeContainerBorderRadius(style)}
                active={shots.containerBorderRadius === style}
              >
                {style === normal ? 'Normal' : style}
              </IconButton>
            )
          })}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Alto del editor</h5>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          <LabeledInput
            type='number'
            value={shots.containerHeight}
            min={200}
            max={1200}
            step={50}
            onChange={e => handleChangeHeight(Number(e.target.value))}
          >
            px
          </LabeledInput>
        </div>

        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[300, 400, 500, 600, 700, 800, 900].map(style => {
            const normal = 600
            return (
              <IconButton key={newKey()} onClick={() => handleChangeHeight(style)} active={shots.containerHeight === style}>
                {style === normal ? 'Normal' : style}
              </IconButton>
            )
          })}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Ancho del editor</h5>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          <LabeledInput
            type='number'
            value={shots.containerWidth}
            min={200}
            max={1200}
            step={50}
            onChange={e => handleChangeWidth(Number(e.target.value))}
          >
            px
          </LabeledInput>
        </div>

        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map(style => {
            const normal = 900
            return (
              <IconButton key={newKey()} onClick={() => handleChangeWidth(style)} active={shots.containerWidth === style}>
                {style === normal ? 'Normal' : style}
              </IconButton>
            )
          })}
        </div>
      </div>

      <div className='monacoPreferences-section flex flex-col gap-grid-lg'>
        <h5 className='paragraph-emphasis'>Padding del editor</h5>
        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          <LabeledInput
            type='number'
            value={shots.containerPadding}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangePadding(Number(e.target.value))}
          >
            px
          </LabeledInput>
        </div>

        <div className='monacoPreferences-switch flex w-full flex-row flex-wrap gap-grid-sm'>
          {[0, 5, 10, 15, 20, 25, 30, 35, 40].map(style => {
            const normal = 10
            return (
              <IconButton key={newKey()} onClick={() => handleChangePadding(style)} active={shots.containerPadding === style}>
                {style === normal ? 'Normal' : style}
              </IconButton>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ShumShotsPreferences
