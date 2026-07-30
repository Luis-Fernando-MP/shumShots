'use client'

import TabBar from '@views/image-studio/Popups/common/components/tabs/TabBar'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { FC } from 'react'

const LayersBuilder: FC = () => {
  const layers = useCanvasLightStore(s => s.layers)
  const activeId = useCanvasLightStore(s => s.activeId)
  const setActive = useCanvasLightStore(s => s.setActive)
  const addLayer = useCanvasLightStore(s => s.addLayer)
  const removeLayer = useCanvasLightStore(s => s.removeLayer)

  return (
    <SectionBlock title='Capas' description='Una o varias luces sobre el mismo canvas (sin slots).'>
      <TabBar
        items={layers}
        activeId={activeId}
        onSelect={setActive}
        onAdd={addLayer}
        onRemove={removeLayer}
        addLabel='Nueva luz'
        labelPrefix='Luz'
      />
    </SectionBlock>
  )
}

export default LayersBuilder
