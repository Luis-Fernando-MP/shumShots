import { Input } from '@common/ui/Input'
import useShumOptionsStore from '@views/code-studio/store/shumOptions.store'
import { type FC, useMemo } from 'react'

import { PreferenceField, PreferencePanel, PreferenceSection, PreferenceToggle } from '../PreferenceField'

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
    <PreferencePanel>
      <PreferenceSection title="Shum shot's:" subtitle='Detalles visuales del shot: icono, radio y tamaño.'>
        <PreferenceField
          title='Icono del lenguaje'
          subtitle='Badge sobre el editor'
          description='Muestra el icono del lenguaje actual en el shot.'
        >
          <PreferenceToggle
            value={shots.showLanguageIcon}
            options={[true, false] as const}
            onChange={shots.setShowLanguageIcon}
          />
        </PreferenceField>

        <PreferenceField
          title='Sombra del icono'
          subtitle='Glow para iconos claros'
          description='Ayuda cuando el logo es blanco o muy transparente.'
          note='Requiere icono del lenguaje activo.'
        >
          <PreferenceToggle
            value={shots.shadowLanguage}
            options={[true, false] as const}
            onChange={shots.setShadowLanguage}
          />
        </PreferenceField>

        <PreferenceField
          title='Radio del editor'
          subtitle='Esquinas del área de código'
          example='Ej: Normal = 20px'
        >
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={shots.borderRadius}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangeBorderRadius(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={shots.borderRadius}
            options={[0, 5, 10, 15, 20, 25, 30, 35, 40] as const}
            onChange={handleChangeBorderRadius}
            normal={20}
          />
        </PreferenceField>

        <PreferenceField
          title='Radio del contenedor'
          subtitle='Esquinas del marco exterior'
          example='Ej: 0 = cuadrado; 20 = suave'
        >
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={shots.containerBorderRadius}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangeContainerBorderRadius(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={shots.containerBorderRadius}
            options={[0, 5, 10, 15, 20, 25, 30, 35, 40] as const}
            onChange={handleChangeContainerBorderRadius}
            normal={20}
          />
        </PreferenceField>

        <PreferenceField title='Alto' subtitle='Altura del editor' example='Ej: Normal = 600px'>
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={shots.containerHeight}
            min={200}
            max={1200}
            step={50}
            onChange={e => handleChangeHeight(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={shots.containerHeight}
            options={[300, 400, 500, 600, 700, 800, 900] as const}
            onChange={handleChangeHeight}
            normal={600}
          />
        </PreferenceField>

        <PreferenceField title='Ancho' subtitle='Ancho del editor' example='Ej: Normal = 900px'>
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={shots.containerWidth}
            min={200}
            max={1200}
            step={50}
            onChange={e => handleChangeWidth(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={shots.containerWidth}
            options={[300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200] as const}
            onChange={handleChangeWidth}
            normal={900}
          />
        </PreferenceField>

        <PreferenceField
          title='Padding'
          subtitle='Aire interno del marco'
          example='Ej: Normal = 10px'
        >
          <Input
            type='number'
            size='sm'
            variant='outline'
            suffix='px'
            value={shots.containerPadding}
            min={0}
            max={100}
            step={5}
            onChange={e => handleChangePadding(Number(e.target.value))}
            containerClassName='w-[7.5rem]'
          />
          <PreferenceToggle
            value={shots.containerPadding}
            options={[0, 5, 10, 15, 20, 25, 30, 35, 40] as const}
            onChange={handleChangePadding}
            normal={10}
          />
        </PreferenceField>
      </PreferenceSection>
    </PreferencePanel>
  )
}

export default ShumShotsPreferences
