import type { FC, HTMLAttributes } from 'react';

import { twMerge } from 'tailwind-merge';

import { type StyleStatus } from '../common/types';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchStatus = StyleStatus;
export type SwitchValue = boolean | 'middle';

export interface SwitchProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * Indica si el switch está activado
   */
  on: SwitchValue;
  /**
   * Función a ejecutar al hacer clic en el switch
   */
  onChange?: () => void;
  /**
   * El tamaño del switch
   * @default 'md'
   */
  size?: SwitchSize;
  /**
   * El estado semántico que determina el color cuando está activado
   * @default 'primary'
   */
  status?: SwitchStatus;
  /**
   * Deshabilita la interacción con el switch
   * @default false
   */
  disabled?: boolean;
}

const sizeClasses: Record<
  SwitchSize,
  {
    track: string;
    thumb: string;
    top: string;
    onTranslate: string;
    offTranslate: string;
    middleTranslate: string;
  }
> = {
  sm: {
    track: 'w-8 h-[18px]',
    thumb: 'w-[14px] h-[14px]',
    top: 'top-[2px]',
    offTranslate: 'left-[2px]',
    onTranslate: 'left-[calc(100%-16px)]',
    middleTranslate: 'left-[calc(50%-7px)]',
  },
  md: {
    track: 'w-10 h-[23px]',
    thumb: 'w-[18px] h-[18px]',
    top: 'top-[2.5px]',
    offTranslate: 'left-[2.5px]',
    onTranslate: 'left-[calc(100%-20.5px)]',
    middleTranslate: 'left-[calc(50%-9px)]',
  },
  lg: {
    track: 'w-12 h-[28px]',
    thumb: 'w-[22px] h-[22px]',
    top: 'top-[3px]',
    offTranslate: 'left-[3px]',
    onTranslate: 'left-[calc(100%-25px)]',
    middleTranslate: 'left-[calc(50%-11px)]',
  },
};

const statusTrackFill: Record<SwitchStatus, { on: string; middle: string }> = {
  default: {
    on: 'bg-muted-foreground',
    middle: 'bg-muted-foreground/50',
  },
  primary: {
    on: 'bg-primary',
    middle: 'bg-primary/50',
  },
  success: {
    on: 'bg-emerald-500',
    middle: 'bg-emerald-500/50',
  },
  warning: {
    on: 'bg-amber-500',
    middle: 'bg-amber-500/50',
  },
  error: {
    on: 'bg-rose-500',
    middle: 'bg-rose-500/50',
  },
  info: {
    on: 'bg-sky-500',
    middle: 'bg-sky-500/50',
  },
};

const Switch: FC<SwitchProps> = ({
  on,
  onChange,
  size = 'md',
  status = 'primary',
  disabled = false,
  className,
  ...props
}) => {
  const { track, thumb, top, onTranslate, offTranslate, middleTranslate } = sizeClasses[size];
  const fill = statusTrackFill[status];
  const isMiddle = on === 'middle';
  const isOn = on === true;
  const translateClass = isOn ? onTranslate : isMiddle ? middleTranslate : offTranslate;
  const fillClass = isOn ? fill.on : isMiddle ? fill.middle : null;

  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-disabled={disabled}
      data-state={isMiddle ? 'middle' : isOn ? 'checked' : 'unchecked'}
      onClick={disabled ? undefined : (onChange ?? (() => {}))}
      disabled={disabled}
      className={twMerge(
        'relative flex-shrink-0 overflow-hidden rounded-full bg-muted transition-colors duration-200',
        track,
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {fillClass && (
        <span
          aria-hidden
          className={twMerge(
            'absolute inset-0 rounded-full transition-colors duration-200',
            fillClass
          )}
        />
      )}
      <span
        className={twMerge(
          'absolute z-[1] rounded-full bg-white shadow-sm transition-all duration-200',
          top,
          thumb,
          translateClass
        )}
      />
    </button>
  );
};

export default Switch;
