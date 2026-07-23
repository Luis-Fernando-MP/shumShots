import { type FC, type HTMLAttributes, memo } from 'react';

import { getDefaultLocale, useNumberFormat } from '@common/hooks';
import { twMerge } from 'tailwind-merge';

export type { FormatDecimals as CurrencyDecimals } from '@common/hooks';
export type { FormatMode as CurrencyMode } from '@common/hooks';
export type { FormatSignDisplay as CurrencySignDisplay } from '@common/hooks';

export interface CurrencyProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Número a formatear. `null` / `undefined` renderiza `fallbackText`.
   */
  value: number | null | undefined;
  /**
   * `'full'` → estándar · `'short'` → compacto (K, M, B).
   * @default 'full'
   */
  mode?: 'full' | 'short';
  /**
   * Cantidad fija de decimales — establece `min` y `max` al mismo valor.
   * Tiene precedencia sobre `minDecimals` y `maxDecimals`.
   */
  decimals?: number;
  /**
   * Mínimo de decimales, se ignora la propiedad `minimumFractionDigits` si se pasa `decimals`.
   */
  minDecimals?: number;
  /**
   * Máximo de decimales, se ignora la propiedad `maximumFractionDigits` si se pasa `decimals`.
   */
  maxDecimals?: number;
  /**
   * `true` → usa los decimales por defecto de ECMA-402 para la moneda.
   * `false` → precisión exacta hasta 13 decimales.
   * Se ignora si hay `decimals`, `minDecimals` o `maxDecimals` explícitos.
   * @default true
   */
  autoDecimals?: boolean;
  /**
   * Techo absoluto de decimales cuando no hay límites explícitos.
   * @default 13
   */
  maximumFractionDigits?: number;
  /**
   * `true` → incluye el símbolo monetario
   * `false` → solo formato decimal.
   * @default true
   */
  showCurrency?: boolean;
  /**
   * Elimina ceros finales de la parte decimal: `1.50` → `1.5`.
   * @default false
   */
  trimZeros?: boolean;
  /**
   * Fuerza `mode='short'` automáticamente cuando `Math.abs(value) >= compactThreshold`.
   * Ej: `compactThreshold={1000}` → `1234` → `1.2K`
   */
  compactThreshold?: number;
  /**
   * Texto antepuesto al valor formateado.
   * @default ''
   */
  prefix?: string;
  /**
   * Texto pospuesto al valor formateado.
   * @default ''
   */
  suffix?: string;
  /**
   * Texto renderizado cuando `value` es `null` o `undefined`.
   * @default '-'
   */
  fallbackText?: string;
  /**
   * Visibilidad del signo +/− (ECMA-402 `signDisplay`).
   * @default 'auto'
   */
  signDisplay?: 'auto' | 'always' | 'never' | 'exceptZero';
  /**
   * Override de locale BCP 47. Prevalece sobre `navigator.language`.
   * Ej: `'es-PE'`, `'en-US'`, `'pt-BR'`, `'es-MX'`
   */
  locale?: string;
  /**
   * Override de código ISO 4217. Prevalece sobre la moneda del store global.
   * Ej: `'PEN'`, `'USD'`, `'EUR'`
   */
  currency?: string;
  /**
   * Override manual del símbolo monetario.
   * Ej: `'S/.'`, `'US$'`
   */
  currencySymbol?: string;
}

const CurrencyComponent: FC<CurrencyProps> = ({
  value,
  mode = 'full',
  decimals,
  minDecimals,
  maxDecimals,
  autoDecimals = true,
  maximumFractionDigits = 13,
  showCurrency = true,
  trimZeros = false,
  compactThreshold,
  prefix = '',
  suffix = '',
  fallbackText,
  signDisplay = 'auto',
  locale: localeProp,
  currency: currencyProp,
  currencySymbol: currencySymbolProp,
  ...spanProps
}) => {
  const locale = localeProp ?? getDefaultLocale();
  const currency = currencyProp ?? 'USD';
  const currencySymbol = currencySymbolProp;

  const { displayText, ariaLabel } = useNumberFormat({
    value,
    mode,
    decimals,
    minDecimals,
    maxDecimals,
    autoDecimals,
    maximumFractionDigits,
    showCurrency,
    trimZeros,
    compactThreshold,
    signDisplay,
    locale,
    currency,
    currencySymbol,
    prefix,
    suffix,
    ariaLabelOverride: (spanProps as HTMLAttributes<HTMLSpanElement>)['aria-label'],
  });

  if (value == null) return <span {...spanProps}>{fallbackText ?? '-'}</span>;

  return (
    <span
      {...spanProps}
      aria-label={ariaLabel}
      role="text"
      className={twMerge('font-sans text-xs', spanProps?.className)}
    >
      {displayText}
    </span>
  );
};
/**
 * Renderiza un importe monetario formateado dentro de un `<span>`.
 *
 * Resuelve el locale desde `navigator.language` y usa USD por defecto. Ambos valores
 * se pueden sobrescribir con props. Los valores `null` / `undefined` renderizan
 * `fallbackText` sin lanzar errores.
 *
 * > **Solo para importes monetarios.** Para números sin divisa usa `<Num />`.
 *
 * Estándares implementados:
 * - **ISO 4217** — códigos de moneda resueltos desde la prop `currency`.
 * - **BCP 47** — locale resuelto desde `navigator.language` o prop `locale`.
 * - **ECMA-402** — `Intl.NumberFormat` controla `style`, `notation`, `signDisplay` y fracciones.
 * - **Unicode CLDR** — nombres localizados de moneda usados en `aria-label`.
 * - **Unicode TR#9** — algoritmo UBA para RTL gestionado por `Intl.NumberFormat`.
 * - **WCAG 2.1 AA** — `aria-label` en `notation: 'standard'` para screen readers.
 *
 * @property value - Número a formatear. `null` / `undefined` renderiza `fallbackText`.
 * @property mode - `'full'` → estándar · `'short'` → compacto (K, M, B). @default 'full'
 * @property decimals - Cantidad fija de decimales — establece `min` y `max` al mismo valor. Tiene precedencia sobre `minDecimals` y `maxDecimals`.
 * @property minDecimals - Mínimo de decimales (`minimumFractionDigits`). Ignorado si se pasa `decimals`.
 * @property maxDecimals - Máximo de decimales (`maximumFractionDigits`). Junto a `minDecimals` define `[min..max]`. Ignorado si se pasa `decimals`.
 * @property autoDecimals - `true` → usa los decimales por defecto de ECMA-402 para la moneda. `false` → precisión exacta hasta 20 decimales. Se ignora si hay `decimals`, `minDecimals` o `maxDecimals` explícitos. @default true
 * @property maximumFractionDigits - Techo absoluto de decimales cuando no hay límites explícitos. @default 13
 * @property showCurrency - `true` → incluye el símbolo monetario · `false` → solo formato decimal. @default true
 * @property trimZeros - Elimina ceros finales de la parte decimal (`1.50 → 1.5`). @default false
 * @property compactThreshold - Fuerza `mode='short'` automáticamente cuando `Math.abs(value) >= compactThreshold`.
 * @property prefix - Texto antepuesto al valor formateado. @default ''
 * @property suffix - Texto pospuesto al valor formateado. @default ''
 * @property fallbackText - Texto renderizado cuando `value` es `null` o `undefined`. @default '-'
 * @property signDisplay - Visibilidad del signo +/− (ECMA-402 `signDisplay`). @default 'auto'
 * @property locale - Override de locale BCP 47. Prevalece sobre `navigator.language`.
 * @property currency - Override de código ISO 4217.
 * @property currencySymbol - Override manual del símbolo monetario (ej. `'S/.'`, `'US$'`).
 *
 * @example
 * // Decimales fijos
 * <Currency value={1.9999} decimals={2} />
 * // → S/ 2.00
 *
 * @example
 * // Formato financiero estándar — locale es-PE → PEN
 * <Currency value={1000} mode="full" />
 * // → S/ 1,000.00
 *
 * @example
 * // Modo compacto
 * <Currency value={1500000} mode="short" />
 * // → S/1.5M
 *
 * @example
 * // Sin símbolo monetario
 * <Currency value={1000} showCurrency={false} />
 * // → 1,000
 *
 * @example
 * // Rango de decimales [1..4]
 * <Currency value={1.12345} minDecimals={1} maxDecimals={4} showCurrency={false} />
 * // → 1.1235
 *
 * @example
 * // Signo explícito
 * <Currency value={200} signDisplay="always" />
 * // → +S/ 200.00
 *
 * @example
 * // Override de locale y moneda
 * <Currency value={5000} locale="de-DE" currency="EUR" />
 * // → 5.000,00 €
 *
 * @example
 * // Compactación automática al superar umbral
 * <Currency value={2500000} compactThreshold={1_000_000} />
 * // → S/2.5M
 *
 * @example
 * // Símbolo personalizado
 * <Currency value={100} currency="USD" currencySymbol="US$" />
 * // → US$100.00
 *
 * @example
 * // Prefix, suffix y clases nativas
 * <Currency value={1000} prefix="≈ " suffix=" /mes" className="text-green-600 font-semibold" />
 * // → ≈ S/ 1,000.00 /mes
 *
 * @example
 * // Fallback para valor nulo
 * <Currency value={null} fallbackText="N/A" />
 * // → N/A
 */
const Currency = memo(CurrencyComponent);
Currency.displayName = 'Currency';

export { Currency };
