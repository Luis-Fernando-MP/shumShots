import Button from '@/shared/ui/Button'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import type { ReactNode } from 'react'

interface PreferenceFieldProps {
  title: string
  /** One-line lead under the title. */
  subtitle?: ReactNode
  /** Short supporting paragraph. */
  description?: ReactNode
  /** Tiny concrete example. */
  example?: ReactNode
  /** Caution / dependency note. */
  note?: ReactNode
  children: ReactNode
  className?: string
}

/** Single preference row with title → subtitle → body → example → note hierarchy. */
export const PreferenceField = ({
  title,
  subtitle,
  description,
  example,
  note,
  children,
  className
}: PreferenceFieldProps) => (
  <div className={cn('flex flex-col gap-2', className)}>
    <div className='flex flex-col gap-1'>
      <Typography.Emphasis className='leading-snug'>{title}</Typography.Emphasis>

      {subtitle != null && (
        <Typography.Small weight='medium' className='text-foreground/70 leading-snug'>
          {subtitle}
        </Typography.Small>
      )}

      {description != null && (
        <Typography.Paragraph tone='secondary' className='m-0 leading-snug'>
          {description}
        </Typography.Paragraph>
      )}

      {example != null && (
        <Typography.Cite className='text-muted-foreground'>
          {example}
        </Typography.Cite>
      )}

      {note != null && (
        <Typography.Text className='leading-snug'>
          <Typography.Precaution>{note}</Typography.Precaution>
        </Typography.Text>
      )}
    </div>

    <div className='flex flex-wrap items-center gap-1.5'>{children}</div>
  </div>
)

interface PreferencePanelProps {
  children: ReactNode
  className?: string
}

/** Nested group with primary left accent — PIXIS preference essence. */
export const PreferencePanel = ({ children, className }: PreferencePanelProps) => (
  <div
    className={cn(
      'border-border/40 bg-card/40 flex flex-col gap-3 rounded-md border border-l-[3px] border-l-primary/70 p-3',
      className
    )}
  >
    {children}
  </div>
)

interface PreferenceSectionProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
  className?: string
}

/** Top-level `# Section` with optional subtitle under the block title. */
export const PreferenceSection = ({ title, subtitle, children, className }: PreferenceSectionProps) => (
  <Typography.Block title={title} className={cn('gap-3', className)}>
    {subtitle != null && (
      <Typography.Paragraph tone='secondary' className='m-0 -mt-1 leading-snug'>
        {subtitle}
      </Typography.Paragraph>
    )}
    <div className='flex flex-col gap-3.5'>{children}</div>
  </Typography.Block>
)

interface PreferenceToggleProps<T extends string | number | boolean> {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  label?: (option: T) => ReactNode
  normal?: T
}

/** Compact option chips for preference values. */
export function PreferenceToggle<T extends string | number | boolean>({
  value,
  options,
  onChange,
  label,
  normal
}: PreferenceToggleProps<T>) {
  return (
    <>
      {options.map(option => {
        const isNormal = normal !== undefined && option === normal
        const text =
          label?.(option) ??
          (typeof option === 'boolean' ? (option ? 'On' : 'Off') : isNormal ? 'Normal' : String(option))

        return (
          <Button
            key={String(option)}
            size='sm'
            variant='soft'
            isSelected={value === option}
            onClick={() => onChange(option)}
          >
            {text}
          </Button>
        )
      })}
    </>
  )
}
