'use client'

import { Tab } from '@common/components/Tabs'
import Text from '@common/components/Text'
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

/**
 * Tabs de sidebar: intro del tab activo + triggers con icono.
 */
const AppTabs = ({ children, defaultValue, value, onValueChange, className }: AppTabsProps) => {
  const tabs: AppTabProps[] = []

  Children.forEach(children, child => {
    if (isAppTab(child)) tabs.push(child.props)
  })

  const initial = defaultValue ?? tabs[0]?.value
  const [uncontrolled, setUncontrolled] = useState(initial)
  const current = value ?? uncontrolled
  const active = tabs.find(tab => tab.value === current) ?? tabs[0]
  const ActiveIcon = active?.icon

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
      <div className='border-border/50 shrink-0 space-y-3 border-b px-3 py-3'>
        {active && (
          <div className='flex items-start gap-2.5'>
            {ActiveIcon && (
              <span className='bg-muted text-foreground mt-0.5 grid size-8 place-content-center rounded-[12px]'>
                <ActiveIcon className='size-4' />
              </span>
            )}
            <div className='min-w-0'>
              <Text.title>{active.label}</Text.title>
              {active.description && <Text.subtitle className='mt-0.5'>{active.description}</Text.subtitle>}
            </div>
          </div>
        )}
        <Tab.List>
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <Tab.Trigger key={tab.value} value={tab.value}>
                {Icon && <Icon className='size-3.5' />}
                {tab.label}
              </Tab.Trigger>
            )
          })}
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
