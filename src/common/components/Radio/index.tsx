import type { ButtonHTMLAttributes, FC } from 'react';

import { twMerge } from 'tailwind-merge';

import { type StyleStatus } from '../common/types';

export type RadioSize = 'xs' | 'sm' | 'md' | 'lg';
export type RadioStatus = StyleStatus;
export type RadioVariant = 'fill' | 'outline';

export interface RadioProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: () => void;
  size?: RadioSize;
  status?: RadioStatus;
  variant?: RadioVariant;
  hidden?: boolean;
}

const sizeClasses: Record<RadioSize, { box: string; dot: string }> = {
  xs: { box: 'w-3.5 h-3.5', dot: 'w-[6px] h-[6px]' },
  sm: { box: 'w-4 h-4', dot: 'w-[7px] h-[7px]' },
  md: { box: 'w-[18px] h-[18px]', dot: 'w-2 h-2' },
  lg: { box: 'w-5 h-5', dot: 'w-[10px] h-[10px]' },
};

const fillStyles: Record<RadioStatus, { checked: string; unchecked: string; dotBg: string }> = {
  default: {
    checked: 'bg-muted-foreground border-muted-foreground',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-muted-foreground',
    dotBg: 'bg-white',
  },
  primary: {
    checked: 'bg-primary border-primary',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-primary',
    dotBg: 'bg-white',
  },
  success: {
    checked: 'bg-emerald-500 border-emerald-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-emerald-500',
    dotBg: 'bg-white',
  },
  warning: {
    checked: 'bg-amber-500 border-amber-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-amber-500',
    dotBg: 'bg-white',
  },
  error: {
    checked: 'bg-rose-500 border-rose-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-rose-500',
    dotBg: 'bg-white',
  },
  info: {
    checked: 'bg-sky-500 border-sky-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-sky-500',
    dotBg: 'bg-white',
  },
};

const outlineStyles: Record<RadioStatus, { checked: string; unchecked: string; dotBg: string }> = {
  default: {
    checked: 'bg-transparent border-muted-foreground',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-muted-foreground',
    dotBg: 'bg-muted-foreground',
  },
  primary: {
    checked: 'bg-transparent border-primary',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-primary',
    dotBg: 'bg-primary',
  },
  success: {
    checked: 'bg-transparent border-emerald-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-emerald-500',
    dotBg: 'bg-emerald-500',
  },
  warning: {
    checked: 'bg-transparent border-amber-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-amber-500',
    dotBg: 'bg-amber-500',
  },
  error: {
    checked: 'bg-transparent border-rose-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-rose-500',
    dotBg: 'bg-rose-500',
  },
  info: {
    checked: 'bg-transparent border-sky-500',
    unchecked: 'bg-card border-muted-foreground/35 hover:border-sky-500',
    dotBg: 'bg-sky-500',
  },
};

const Radio: FC<RadioProps> = ({
  checked,
  onChange,
  size = 'md',
  status = 'primary',
  variant = 'fill',
  className,
  hidden,
  ...props
}) => {
  const currentStyles = variant === 'fill' ? fillStyles[status] : outlineStyles[status];
  const stateClasses = checked ? currentStyles.checked : currentStyles.unchecked;
  const dotBgClass = currentStyles.dotBg;

  return (
    <button
      type='button'
      role="radio"
      aria-checked={checked}
      onClick={onChange}
      className={twMerge(
        'border-2 inline-flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 rounded-full',
        sizeClasses[size].box,
        stateClasses,
        hidden && 'invisible',
        className
      )}
      {...props}
    >
      {checked && <span className={twMerge('rounded-full', sizeClasses[size].dot, dotBgClass)} />}
    </button>
  );
};

export { Radio }
export default Radio;
