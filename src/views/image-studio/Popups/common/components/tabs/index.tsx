'use client'

import Typography from '@common/ui/Typography'
import type { TabScope } from '@views/image-studio/constants'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  type FC,
  type ReactElement,
  type ReactNode
} from 'react'

import { claimedSlotIds, getTabsStore, type TabLayer } from './store'
import TabBar from './TabBar'
import TargetSlotsPicker from './TargetSlotsPicker'

export type TabsContentArgs = {
  selectedSlots: string[]
  selectedTab: TabLayer
  historyTabs: TabLayer[]
}

type TabsContextValue = TabsContentArgs & {
  scope: TabScope
}

const TabsContext = createContext<TabsContextValue | null>(null)

export const useTabsContext = () => {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs hooks deben usarse dentro de <Tabs>')
  return ctx
}

export const useActiveTabTargets = () => useTabsContext().selectedSlots
export const useActiveTabId = () => useTabsContext().selectedTab.id
export const useHistoryTabs = () => useTabsContext().historyTabs

type TabsRootProps = {
  scope: TabScope
  children: ReactNode
  addLabel?: string
  exclusiveTargets?: boolean
  onTabsChange?: (layers: TabLayer[], activeId: string) => void
}

type TitleProps = { children: ReactNode }

type ContentProps = {
  children: ReactNode | ((args: TabsContentArgs) => ReactNode)
}

const TabsTitle: FC<TitleProps> = ({ children }) => (
  <Typography.Label size='xs' weight='semibold' className='text-foreground tracking-wide'>
    {children}
  </Typography.Label>
)
TabsTitle.displayName = 'Tabs.Title'

const TabsContent: FC<ContentProps> = ({ children }) => {
  const args = useTabsContext()
  if (typeof children === 'function') return <>{children(args)}</>
  return <>{children}</>
}
TabsContent.displayName = 'Tabs.Content'

const isTitle = (child: ReactNode): child is ReactElement<TitleProps> =>
  isValidElement(child) && child.type === TabsTitle

const isContent = (child: ReactNode): child is ReactElement<ContentProps> =>
  isValidElement(child) && child.type === TabsContent

const EMPTY_TARGETS: string[] = []

const TabsRoot: FC<TabsRootProps> = ({
  scope,
  children,
  addLabel = 'Nueva capa',
  exclusiveTargets = false,
  onTabsChange
}) => {
  const store = getTabsStore(scope)
  const layers = store(s => s.layers)
  const activeLayerId = store(s => s.activeLayerId)
  const setActiveLayer = store(s => s.setActiveLayer)
  const addLayer = store(s => s.addLayer)
  const removeLayer = store(s => s.removeLayer)
  const setLayerTargets = store(s => s.setLayerTargets)
  const pictures = usePicturesStore(s => s.pictures)

  const activeLayer = layers.find(layer => layer.id === activeLayerId) ?? layers[0]
  const selectedSlots = activeLayer?.targetIds ?? EMPTY_TARGETS
  const allSlotIds = useMemo(() => pictures.map(picture => picture.id), [pictures])
  const claimedIds = useMemo(
    () => (exclusiveTargets ? claimedSlotIds(layers, activeLayerId, allSlotIds) : []),
    [allSlotIds, exclusiveTargets, layers, activeLayerId]
  )
  const claimedSet = useMemo(() => new Set(claimedIds), [claimedIds])
  const unusedIds = useMemo(
    () => allSlotIds.filter(id => !claimedSet.has(id)),
    [allSlotIds, claimedSet]
  )
  const someLayerClaimsAll = exclusiveTargets && layers.some(layer => layer.targetIds.length === 0)
  const addDisabled = exclusiveTargets && (someLayerClaimsAll || unusedIds.length === 0)
  const addDisabledReason = someLayerClaimsAll
    ? 'Quita “Todos los slots” de un grupo para crear otro'
    : 'Todos los slots ya están asignados'

  const { title, content } = useMemo(() => {
    let titleNode: ReactNode = null
    let contentNode: ReactNode = null
    Children.forEach(children, child => {
      if (isTitle(child)) titleNode = child
      else if (isContent(child)) contentNode = child
    })
    return { title: titleNode, content: contentNode }
  }, [children])

  const value = useMemo<TabsContextValue>(
    () => ({
      scope,
      selectedSlots,
      selectedTab: activeLayer ?? { id: activeLayerId, targetIds: [] },
      historyTabs: layers
    }),
    [scope, selectedSlots, activeLayer, activeLayerId, layers]
  )

  return (
    <TabsContext.Provider value={value}>
      <div className='gap-grid flex flex-col'>
        {title}
        <div className='flex flex-col gap-2.5'>
          <TabBar
            items={layers}
            activeId={activeLayerId}
            onSelect={id => {
              setActiveLayer(id)
              onTabsChange?.(store.getState().layers, id)
            }}
            onAdd={() => {
              if (addDisabled) return
              addLayer(exclusiveTargets ? unusedIds.slice(0, 1) : undefined)
              const next = store.getState()
              onTabsChange?.(next.layers, next.activeLayerId)
            }}
            onRemove={id => {
              removeLayer(id)
              const next = store.getState()
              onTabsChange?.(next.layers, next.activeLayerId)
            }}
            addLabel={addLabel}
            labelPrefix='Grupo'
            addDisabled={addDisabled}
            addDisabledReason={addDisabledReason}
          />
          <TargetSlotsPicker
            targetIds={selectedSlots}
            exclusive={exclusiveTargets}
            claimedIds={claimedIds}
            allowAll={!exclusiveTargets || layers.length === 1}
            lockLastChip={exclusiveTargets && layers.length > 1}
            onChange={ids => {
              setLayerTargets(ids)
              const next = store.getState()
              onTabsChange?.(next.layers, next.activeLayerId)
            }}
          />
        </div>
        {content}
      </div>
    </TabsContext.Provider>
  )
}

type TabsComponent = FC<TabsRootProps> & {
  Title: typeof TabsTitle
  Content: typeof TabsContent
}

const Tabs = TabsRoot as TabsComponent
Tabs.Title = TabsTitle
Tabs.Content = TabsContent

export default Tabs
export { TabsTitle, TabsContent, TargetSlotsPicker, TabBar }
export type { TabLayer }
