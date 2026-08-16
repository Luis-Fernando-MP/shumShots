'use client'

import { cn } from '@common/utils/cn'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react'

import { TabLayer } from './extension/layer'

const TabRoot = TabsPrimitive.Root

const TabList = forwardRef<ElementRef<typeof TabsPrimitive.List>, ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex h-auto w-full flex-wrap items-center justify-start gap-1', className)}
      {...props}
    />
  )
)
TabList.displayName = 'Tab.List'

const TabTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1.5 rounded-[12px] border border-transparent px-2.5 py-1.5 text-xs font-medium',
      'text-muted-foreground transition-colors',
      'hover:bg-muted/70 hover:text-foreground',
      'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-primary/25 data-[state=active]:text-foreground',
      className
    )}
    {...props}
  />
))
TabTrigger.displayName = 'Tab.Trigger'

const TabContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn('min-h-0 outline-none', className)} {...props} />
))
TabContent.displayName = 'Tab.Content'

const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Content: TabContent,
  Layer: TabLayer
})

const Tabs = TabRoot
const TabsList = TabList
const TabsTrigger = TabTrigger
const TabsContent = TabContent

export { Tab, TabContent, TabLayer, TabList, TabTrigger, Tabs, TabsContent, TabsList, TabsTrigger }
