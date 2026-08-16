import { type FC, type HTMLAttributes, memo } from 'react';

import { getDefaultLocale, useNumberFormat } from '@common/hooks';
import { twMerge } from 'tailwind-merge';

export interface NumProps extends HTMLAttributes<HTMLSpanElement> {
  /** Número a formatear. `null` / `undefined` renderiza `fallbackText`. */
  value: number | null | undefined;
  /** `'full'` → estándar · `'short'` → compacto (K, M, B). @default 'full' */
  mode?: 'full' | 'short';
  /** Cantidad fija de decimales — establece `min` y `max` al mismo valor. Tiene precedencia sobre `minDecimals` y `maxDecimals`. */
  decimals?: number;
  /** Mínimo de decimales (`minimumFractionDigits`). Ignorado si se pasa `decimals`. */
  minDecimals?: number;
  /** Máximo de decimales (`maximumFractionDigits`). Junto a `minDecimals` define `[min..max]`. Ignorado si se pasa `decimals`. */
  maxDecimals?: number;
  /**
   * `true` → usa el default de ECMA-402 (hasta 3 decimales).
   * `false` → precisión exacta hasta 20 decimales.
   * Se ignora si hay `decimals`, `minDecimals` o `maxDecimals` explícitos.
   * @default true
   */
  autoDecimals?: boolean;
  /** Techo absoluto de decimales cuando no hay límites explícitos. @default 13 */
  maximumFractionDigits?: number;
  /** Elimina ceros finales de la parte decimal (`1.50 → 1.5`). @default false */
  trimZeros?: boolean;
  /** Fuerza `mode='short'` automáticamente cuando `Math.abs(value) >= compactThreshold`. */
  compactThreshold?: number;
  /** Texto antepuesto al valor formateado. @default '' */
  prefix?: string;
  /** Texto pospuesto al valor formateado. @default '' */
  suffix?: string;
  /** Texto renderizado cuando `value` es `null` o `undefined`. @default '-' */
  fallbackText?: string;
  /** Visibilidad del signo +/− (ECMA-402 `signDisplay`). @default 'auto' */
  signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero';
  /** Override de locale BCP 47. Prevalece sobre `navigator.language`. */
  locale?: string;
}

const NumComponent: FC<NumProps> = ({
  value,
  mode = 'full',
  decimals,
  minDecimals,
  maxDecimals,
  autoDecimals = true,
  maximumFractionDigits = 13,
  trimZeros = false,
  compactThreshold,
  prefix = '',
  suffix = '',
  fallbackText,
  signDisplay = 'auto',
  locale: localeProp,
  ...spanProps
}) => {
  const locale = localeProp ?? getDefaultLocale();

  const { displayText, ariaLabel } = useNumberFormat({
    value,
    mode,
    decimals,
    minDecimals,
    maxDecimals,
    autoDecimals,
    maximumFractionDigits,
    showCurrency: false,
    trimZeros,
    compactThreshold,
    signDisplay,
    locale,
    prefix,
    suffix,
    ariaLabelOverride: (spanProps as HTMLAttributes<HTMLSpanElement>)['aria-label'],
  });

  if (value == null) return <span {...spanProps}>{fallbackText ?? '-'}</span>;

  return (
    <span
      {...spanProps}
      aria-label={ariaLabel}
      className={twMerge('font-sans text-xs', spanProps?.className)}
    >
      {displayText}
    </span>
  );
};

/**
 * Renderiza un número puro formateado dentro de un `<span>`, sin contexto de divisa.
 * Ideal para cantidades, métricas, porcentajes, ratios y cualquier valor no monetario.
 *
 * Resuelve locale (BCP 47) desde `navigator.language` sin configuración externa,
 * sobreescribible via prop `locale`. Los valores `null` / `undefined` renderizan
 * `fallbackText` sin lanzar errores.
 *
 * Diferencias clave respecto a `<Currency />`:
 * - No accede a `useUserGlobalStore` ni resuelve moneda.
 * - Siempre usa ECMA-402 `style: 'decimal'`.
 * - `aria-label` anuncia el número completo sin referencia a divisas.
 *
 * > **Solo para números sin contexto de divisa.** Para importes monetarios usa `<Currency />`.
 *
 * Estándares implementados:
 * - **BCP 47** — locale resuelto desde `navigator.language` o prop `locale`.
 * - **ECMA-402** — `Intl.NumberFormat` con `style: 'decimal'`, `notation`, `signDisplay` y fracciones.
 * - **Unicode CLDR** — separadores y formatos numéricos según el locale.
 * - **Unicode TR#9** — algoritmo UBA para RTL gestionado por `Intl.NumberFormat`.
 * - **WCAG 2.1 AA** — `aria-label` en `notation: 'standard'` para screen readers.
 *
 * @param value - Número a formatear. `null` / `undefined` renderiza `fallbackText`.
 * @param mode - `'full'` → estándar · `'short'` → compacto (K, M, B). @default 'full'
 * @param decimals - Cantidad fija de decimales — establece `min` y `max` al mismo valor. Tiene precedencia sobre `minDecimals` y `maxDecimals`.
 * @param minDecimals - Mínimo de decimales (`minimumFractionDigits`). Ignorado si se pasa `decimals`.
 * @param maxDecimals - Máximo de decimales (`maximumFractionDigits`). Junto a `minDecimals` define `[min..max]`. Ignorado si se pasa `decimals`.
 * @param autoDecimals - `true` → usa el default de ECMA-402 (hasta 3 decimales). `false` → precisión exacta hasta 20 decimales. Se ignora si hay `decimals`, `minDecimals` o `maxDecimals` explícitos. @default true
 * @param maximumFractionDigits - Techo absoluto de decimales cuando no hay límites explícitos. @default 13
 * @param trimZeros - Elimina ceros finales de la parte decimal (`1.50 → 1.5`). @default false
 * @param compactThreshold - Fuerza `mode='short'` automáticamente cuando `Math.abs(value) >= compactThreshold`.
 * @param prefix - Texto antepuesto al valor formateado. @default ''
 * @param suffix - Texto pospuesto al valor formateado. @default ''
 * @param fallbackText - Texto renderizado cuando `value` es `null` o `undefined`. @default '-'
 * @param signDisplay - Visibilidad del signo +/− (ECMA-402 `signDisplay`). @default 'auto'
 * @param locale - Override de locale BCP 47. Prevalece sobre `navigator.language`.
 *
 * @example
 * // Decimales fijos
 * <Num value={3.14159} decimals={2} />
 * // → 3.14
 *
 * @example
 * // Entero simple
 * <Num value={42} />
 * // → 42
 *
 * @example
 * // Porcentaje con suffix
 * <Num value={84.2} minDecimals={1} suffix="%" />
 * // → 84.2%
 *
 * @example
 * // Rango de decimales [1..3]
 * <Num value={1.5} minDecimals={1} maxDecimals={3} />
 * // → 1.5  (con value={1.123} → 1.123)
 *
 * @example
 * // Modo compacto para métricas grandes
 * <Num value={1500000} mode="short" />
 * // → 1.5M
 *
 * @example
 * // Compactación automática al superar umbral
 * <Num value={2500000} compactThreshold={1_000_000} />
 * // → 2.5M
 *
 * @example
 * // Signo explícito para deltas y variaciones
 * <Num value={12.5} minDecimals={1} signDisplay="always" suffix="%" />
 * // → +12.5%
 *
 * @example
 * // Entero sin decimales
 * <Num value={1000} decimals={0} />
 * // → 1,000
 *
 * @example
 * // Eliminar ceros finales
 * <Num value={1.5} minDecimals={2} trimZeros />
 * // → 1.5
 *
 * @example
 * // Con unidad y locale específico
 * <Num value={98.6} minDecimals={1} suffix=" °F" locale="en-US" />
 * // → 98.6 °F
 *
 * @example
 * // Fallback para valor nulo
 * <Num value={null} fallbackText="N/D" />
 * // → N/D
 *
 * @example
 * // Composición visual con clases nativas
 * <Num value={9876} mode="short" suffix=" visitas" className="text-blue-500 font-semibold" />
 * // → 9.9K visitas
 */
const Num = memo(NumComponent);
Num.displayName = 'Num';

export { Num };
