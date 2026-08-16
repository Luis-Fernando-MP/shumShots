'use client'

import SliderControl from '@common/components/SliderControl'
import { Button } from '@common/components/Button'
import Typography from '@common/components/Typography'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { getPositionEntry } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'
import {
  resolveSoloPose,
  type SoloPose
} from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/helpers'
import { getOnePose } from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/one.build'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { type FC, useMemo } from 'react'

const round = (value: number, digits = 3) => {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

const compactPose = (pose: Required<SoloPose>) => {
  const next: Record<string, number> = { ax: round(pose.ax), ay: round(pose.ay) }
  if (round(pose.scale) !== 1) next.scale = round(pose.scale)
  if (round(pose.bleed) !== 0) next.bleed = round(pose.bleed)
  if (round(pose.bleed) === 0 && round(pose.inset) !== 0.05) next.inset = round(pose.inset)
  if (round(pose.rotateZ) !== 0) next.rotateZ = round(pose.rotateZ)
  if (round(pose.rotateX) !== 0) next.rotateX = round(pose.rotateX)
  if (round(pose.rotateY) !== 0) next.rotateY = round(pose.rotateY)
  return next
}

const poseSnippet = (pose: Required<SoloPose>) => {
  const compact = compactPose(pose)
  const body = Object.entries(compact)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
  return `placeSolo({ ${body} })`
}

/**
 * Constructor de sección para ajustes finos de posición y rotación 3D.
 * 
 * Permite mover el slot seleccionado en los ejes X/Y, escalarlo,
 * ajustar el bleed y rotarlo en los tres ejes espaciales.
 * 
 * @returns La sección de ajustes avanzados de pose.
 */
const AdvancedPoseBuilder: FC = () => {
  const count = usePicturesStore(s => s.count)
  const selectedId = usePicturesStore(s => s.selectedId)
  const pictures = usePicturesStore(s => s.pictures)
  const positionId = useLayoutStore(s => s.positionId)
  const advancedPose = useLayoutStore(s => s.advancedPose)
  const patchAdvancedPose = useLayoutStore(s => s.patchAdvancedPose)
  const clearAdvancedPose = useLayoutStore(s => s.clearAdvancedPose)

  const entry = useMemo(() => getPositionEntry(count, positionId), [count, positionId])
  const pose = resolveSoloPose(advancedPose ?? getOnePose(positionId))
  const selectedIndex = Math.max(0, pictures.findIndex(picture => picture.id === selectedId))
  const selectedLabel = `#${selectedIndex + 1}`

  return (
    <SectionBlock
      title='Ajustes avanzados'
      description='Mueve a mano el slot seleccionado. El resumen de abajo es para copiar y decidir qué estilos nos quedamos.'
    >
      <div className='flex flex-col gap-3'>
        <SliderControl
          label='Posición X'
          value={Math.round(pose.ax * 100)}
          onChangeRange={value => patchAdvancedPose({ ax: value / 100 })}
          min={0}
          max={100}
          step={1}
          displayValue={`${Math.round(pose.ax * 100)}%`}
        />
        <SliderControl
          label='Posición Y'
          value={Math.round(pose.ay * 100)}
          onChangeRange={value => patchAdvancedPose({ ay: value / 100 })}
          min={0}
          max={100}
          step={1}
          displayValue={`${Math.round(pose.ay * 100)}%`}
        />
        <SliderControl
          label='Escala'
          value={Math.round(pose.scale * 100)}
          onChangeRange={value => patchAdvancedPose({ scale: value / 100 })}
          min={40}
          max={180}
          step={1}
          displayValue={`${round(pose.scale, 2)}×`}
        />
        <SliderControl
          label='Bleed'
          value={Math.round(pose.bleed * 100)}
          onChangeRange={value => patchAdvancedPose({ bleed: value / 100 })}
          min={0}
          max={40}
          step={1}
          displayValue={`${Math.round(pose.bleed * 100)}%`}
        />
        <SliderControl
          label='Rotación Z'
          value={Math.round(pose.rotateZ)}
          onChangeRange={value => patchAdvancedPose({ rotateZ: value })}
          min={-45}
          max={45}
          step={1}
          displayValue={`${Math.round(pose.rotateZ)}°`}
        />
        <SliderControl
          label='Rotación X'
          value={Math.round(pose.rotateX)}
          onChangeRange={value => patchAdvancedPose({ rotateX: value })}
          min={-40}
          max={40}
          step={1}
          displayValue={`${Math.round(pose.rotateX)}°`}
        />
        <SliderControl
          label='Rotación Y'
          value={Math.round(pose.rotateY)}
          onChangeRange={value => patchAdvancedPose({ rotateY: value })}
          min={-50}
          max={50}
          step={1}
          displayValue={`${Math.round(pose.rotateY)}°`}
        />

        {advancedPose && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='w-full text-xs'
            onClick={clearAdvancedPose}
          >
            Volver al estilo «{entry.title}»
          </Button>
        )}

        <Typography.Small tone='secondary' className='text-xs leading-relaxed'>
          Slot {selectedLabel}. Estilo «{entry.title}» ({entry.key}
          {advancedPose && ', ajustado a mano'}). Posición ax {round(pose.ax)} / ay {round(pose.ay)},
          escala {round(pose.scale, 2)}, bleed {round(pose.bleed, 2)}, rotación Z {round(pose.rotateZ)}° · X{' '}
          {round(pose.rotateX)}° · Y {round(pose.rotateY)}°. {poseSnippet(pose)}
        </Typography.Small>
      </div>
    </SectionBlock>
  )
}

export default AdvancedPoseBuilder
