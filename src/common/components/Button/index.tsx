'use client'

import Tooltip from '@common/components/Tooltip'
import type { StyleStatus } from '@common/components/common/types'
import { cn } from '@common/utils/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode } from 'react'

/** Variantes de estilo para el botón PIXIS. */
type ButtonVariant = 'soft' | 'solid' | 'outline' | 'ghost' | 'dashed'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 rounded-radius text-sm font-medium no-underline',
    'transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4'
  ],
  {
    variants: {
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs [&_svg]:size-3.5',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-5 py-2.5 text-base [&_svg]:size-5',
        icon: 'size-9 p-2'
      },
      center: {
        true: 'items-center justify-center gap-1.5',
        false: ''
      }
    },
    defaultVariants: {
      size: 'default',
      center: true
    }
  }
)

const statusStyles: Record<ButtonVariant, Record<StyleStatus, string>> = {
  soft: {
    default: 'bg-muted text-foreground hover:bg-muted/80',
    primary: 'bg-primary/15 text-foreground hover:bg-primary/25',
    success: 'bg-semantic-success/15 text-semantic-success hover:bg-semantic-success/25',
    warning: 'bg-semantic-warning/15 text-semantic-warning hover:bg-semantic-warning/25',
    error: 'bg-semantic-error/15 text-semantic-error hover:bg-semantic-error/25',
    info: 'bg-semantic-info/15 text-semantic-info hover:bg-semantic-info/25'
  },
  solid: {
    default: 'bg-muted text-foreground hover:bg-muted/80',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    success: 'bg-semantic-success text-semantic-success-text hover:bg-semantic-success/90',
    warning: 'bg-semantic-warning text-semantic-warning-text hover:bg-semantic-warning/90',
    error: 'bg-semantic-error text-semantic-error-text hover:bg-semantic-error/90',
    info: 'bg-semantic-info text-semantic-info-text hover:bg-semantic-info/90'
  },
  outline: {
    default: 'border border-border bg-transparent text-foreground hover:bg-muted/70',
    primary: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
    success: 'border border-semantic-success bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning: 'border border-semantic-warning bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'border border-semantic-error bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'border border-semantic-info bg-transparent text-semantic-info hover:bg-semantic-info/10'
  },
  ghost: {
    default: 'bg-transparent text-foreground hover:bg-muted/70',
    primary: 'bg-transparent text-primary hover:bg-primary/10',
    success: 'bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning: 'bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'bg-transparent text-semantic-info hover:bg-semantic-info/10'
  },
  dashed: {
    default: 'border-2 border-dashed border-border bg-transparent text-foreground hover:bg-muted/70',
    primary: 'border-2 border-dashed border-primary bg-transparent text-foreground hover:bg-primary/10',
    success: 'border-2 border-dashed border-semantic-success bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning: 'border-2 border-dashed border-semantic-warning bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'border-2 border-dashed border-semantic-error bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'border-2 border-dashed border-semantic-info bg-transparent text-semantic-info hover:bg-semantic-info/10'
  }
}

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  children?: ReactNode
  /** Texto del tooltip que se muestra al pasar el ratón. */
  tooltip?: string
  /** Posición del tooltip. @default 'top' */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** Estilo visual base. @default 'soft' */
  variant?: ButtonVariant
  /** Estado semántico (color). @default 'default' */
  status?: StyleStatus
  /** Si el botón está seleccionado visualmente. */
  isSelected?: boolean
  /** Si debe usar composición por Slot de Radix. */
  asChild?: boolean
  className?: string
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps | 'href'> & {
    href?: undefined
  }

type ButtonAsLink = ButtonOwnProps &
  Omit<LinkProps, keyof ButtonOwnProps | 'href'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | keyof ButtonOwnProps | 'href'> & {
    href: LinkProps['href']
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

/**
 * Botón estándar de PIXIS con soporte para estados semánticos, tooltips y enlaces.
 * 
 * Implementa las variantes definidas en DESIGN.md y asegura el cumplimiento del
 * radio canónico de 4px.
 * 
 * @param props - Propiedades del botón.
 * @returns El elemento JSX del botón o enlace.
 */
const Button: FC<ButtonProps> = ({
  children,
  className = '',
  tooltip,
  tooltipPosition = 'top',
  variant = 'soft',
  status = 'default',
  size = 'default',
  isSelected = false,
  center = true,
  asChild = false,
  ...props
}) => {
  const Component = asChild ? Slot : 'href' in props && props.href !== undefined ? Link : 'button'
  
  const classes = cn(
    buttonVariants({ size, center }),
    isSelected ? 'bg-primary text-primary-foreground hover:bg-primary/90' : (statusStyles[variant]?.[status] ?? statusStyles.soft.default),
    className
  )

  const content = (
    <Component
      type={!asChild && Component === 'button' ? 'button' : undefined}
      className={classes}
      {...(props as any)}
    >
      {children}
    </Component>
  )

  if (!tooltip) return content

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
      <Tooltip.Content side={tooltipPosition} backgroundColor='bg-card' borderColor='border-border'>
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  )
}

export { Button, buttonVariants }
export default Button
