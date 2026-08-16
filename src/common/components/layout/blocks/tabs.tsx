'use client'

import { Tab } from '@common/components/Tabs'
import Tooltip from '@common/components/Tooltip'
import { cn } from '@common/utils/cn'
import { type LucideIcon } from 'lucide-react'
import { Children, type ReactElement, type ReactNode, isValidElement, useState } from 'react'

interface AppTabProps {
  value: string
  label: string
  description?: string
  icon?: LucideIcon
  children?: ReactNode
}

/**
 * Pestaña de chrome. Solo se usa como hijo de `App.tabs`.
 */
const AppTab = (_props: AppTabProps) => null

AppTab.displayName = 'App.tab'

interface AppTabsProps {
  children?: ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

const isAppTab = (child: ReactNode): child is ReactElement<AppTabProps> =>
  isValidElement(child) && child.type === AppTab

const TabButton = ({
  tab,
  iconOnly
}: {
  tab: AppTabProps
  iconOnly: boolean
}) => {
  const Icon = tab.icon
  const trigger = (
    <Tab.Trigger value={tab.value} aria-label={tab.label} className={cn(iconOnly && 'size-8 p-0')}>
      {Icon && <Icon className='size-3.5' />}
      {!iconOnly && tab.label}
    </Tab.Trigger>
  )

  if (!iconOnly) return trigger

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
      <Tooltip.Content>{tab.label}</Tooltip.Content>
    </Tooltip>
  )
}

/**
 * Tira de tabs de sidebar. Más de cuatro: solo icono. Si no, icono + palabra.
 */
const AppTabs = ({ children, defaultValue, value, onValueChange, className }: AppTabsProps) => {
  const tabs: AppTabProps[] = []

  Children.forEach(children, child => {
    if (isAppTab(child)) tabs.push(child.props)
  })

  const initial = defaultValue ?? tabs[0]?.value
  const [uncontrolled, setUncontrolled] = useState(initial)
  const iconOnly = tabs.length > 4

  const handleChange = (next: string) => {
    if (value == null) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <Tab
      defaultValue={value ? undefined : initial}
      value={value ?? uncontrolled}
      onValueChange={handleChange}
      className={cn('flex min-h-0 flex-1 flex-col', className)}
    >
      <div className='border-border/50 shrink-0 border-b px-2 py-2'>
        <Tab.List
          className={cn(iconOnly && 'grid w-full gap-0.5')}
          style={iconOnly ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` } : undefined}
        >
          {tabs.map(tab => (
            <TabButton key={tab.value} tab={tab} iconOnly={iconOnly} />
          ))}
        </Tab.List>
      </div>

      <div className='min-h-0 flex-1 overflow-hidden'>
        {tabs.map(tab => (
          <Tab.Content key={tab.value} value={tab.value} className='flex h-full flex-col overflow-hidden'>
            {tab.children}
          </Tab.Content>
        ))}
      </div>
    </Tab>
  )
}

AppTabs.displayName = 'App.tabs'

export { AppTab, AppTabs }
