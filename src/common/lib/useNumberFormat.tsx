import { useMemo } from 'react';

export type FormatMode = 'full' | 'short';
export type FormatDecimals = number;
export type FormatSignDisplay = 'auto' | 'always' | 'never' | 'exceptZero';

export interface UseNumberFormatOptions {
  /** Número a formatear. `null` / `undefined` retorna `isEmpty: true`. */
  value: number | null | undefined;
  /** `'full'` → estándar · `'short'` → compacto (K, M, B). @default 'full' */
  mode?: FormatMode;
  /** Cantidad fija de decimales — establece `min` y `max` al mismo valor. Tiene precedencia sobre `minDecimals` y `maxDecimals`. */
  decimals?: number;
  /** Mínimo de decimales (`minimumFractionDigits`). Ignorado si se pasa `decimals`. */
  minDecimals?: FormatDecimals;
  /** Máximo de decimales (`maximumFractionDigits`). Ignorado si se pasa `decimals`. */
  maxDecimals?: number;
  /** Techo absoluto de decimales cuando no hay límites explícitos. @default 13 */
  maximumFractionDigits?: number;
  /**
   * `true` → usa el default de ECMA-402 para la moneda.
   * `false` → precisión exacta hasta 20 decimales.
   * Se ignora si se pasan `decimals`, `minDecimals` o `maxDecimals`.
   * @default true
   */
  autoDecimals?: boolean;
  /** Incluye símbolo monetario con `style: 'currency'`. @default false */
  showCurrency?: boolean;
  /** Elimina ceros finales de la parte decimal (`1.50 → 1.5`). @default false */
  trimZeros?: boolean;
  /** Fuerza `mode='short'` cuando `Math.abs(value) >= compactThreshold`. */
  compactThreshold?: number;
  /** Visibilidad del signo +/− (ECMA-402 `signDisplay`). @default 'auto' */
  signDisplay?: FormatSignDisplay;
  /** Locale BCP 47 (ej. `'es-PE'`). */
  locale: string;
  /** Código de moneda ISO 4217 (ej. `'PEN'`). */
  currency?: string;
  /** Override manual del símbolo monetario (ej. `'S/.'`). */
  currencySymbol?: string;
  /** Texto antepuesto al valor formateado. @default '' */
  prefix?: string;
  /** Texto pospuesto al valor formateado. @default '' */
  suffix?: string;
  /** Sobreescribe el `aria-label` generado automáticamente. */
  ariaLabelOverride?: string;
}

export interface UseNumberFormatResult {
  displayText: string;
  ariaLabel: string;
  isEmpty: boolean;
}

interface FormatValueOptions {
  mode: FormatMode;
  decimals?: number;
  minDecimals?: FormatDecimals;
  maxDecimals?: number;
  maximumFractionDigits?: number;
  autoDecimals: boolean;
  showCurrency: boolean;
  trimZeros: boolean;
  compactThreshold?: number;
  signDisplay: FormatSignDisplay;
  locale: string;
  currency?: string;
  currencySymbol?: string;
}

const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getCachedNumberFormat(
  locale: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  const cached = numberFormatCache.get(key);
  if (cached) return cached;
  const formatter = new Intl.NumberFormat(locale, options);
  numberFormatCache.set(key, formatter);
  return formatter;
}

/** Retorna el locale activo del navegador o `'es-PE'` como fallback. */
export function getDefaultLocale(): string {
  try {
    if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  } catch {
    /* silent */
  }
  return 'es-PE';
}

/** Extrae el símbolo monetario de un código ISO 4217 para el locale dado. */
export function getCurrencySymbol(locale: string, currency: string): string {
  try {
    const parts = getCachedNumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    return parts.find(p => p.type === 'currency')?.value ?? currency;
  } catch {
    return currency;
  }
}

function trimTrailingZeros(formatted: string): string {
  return formatted.replace(/([.,]\d*?)0+(\D*)$/, (_, dec, tail) => {
    const trimmed = dec.replace(/[.,]$/, '');
    return trimmed + tail;
  });
}

function buildDecimalOptions(
  decimals?: number,
  minDecimals?: FormatDecimals,
  maxDecimals?: number,
  autoDecimals = true,
  maximumFractionDigits = 13,
  locale?: string,
  currency?: string
): Partial<Intl.NumberFormatOptions> {
  if (decimals !== undefined) {
    const safe = Math.min(Math.max(0, decimals), maximumFractionDigits);
    return { minimumFractionDigits: safe, maximumFractionDigits: safe };
  }

  const hasExplicitLimits = minDecimals !== undefined || maxDecimals !== undefined;

  if (hasExplicitLimits) {
    const safeMin = minDecimals !== undefined ? Math.max(0, minDecimals) : undefined;
    const safeMax = maxDecimals !== undefined ? Math.max(0, maxDecimals) : undefined;
    const opts: Partial<Intl.NumberFormatOptions> = {};
    if (safeMin !== undefined) opts.minimumFractionDigits = safeMin;
    if (safeMax !== undefined) {
      let effectiveMax = Math.min(safeMax, maximumFractionDigits);
      if (safeMin !== undefined) {
        effectiveMax = Math.max(safeMin, effectiveMax);
      }
      opts.maximumFractionDigits = effectiveMax;
    } else if (safeMin !== undefined) {
      opts.maximumFractionDigits = Math.max(safeMin, maximumFractionDigits);
    }
    return opts;
  }

  if (!autoDecimals)
    return { minimumFractionDigits: 0, maximumFractionDigits: maximumFractionDigits };

  if (currency && locale) {
    try {
      const resolved = getCachedNumberFormat(locale, {
        style: 'currency',
        currency,
      }).resolvedOptions();
      const cappedMax = Math.min(resolved.maximumFractionDigits ?? 0, maximumFractionDigits);
      const cappedMin = Math.min(resolved.minimumFractionDigits ?? 0, cappedMax);
      return {
        minimumFractionDigits: cappedMin,
        maximumFractionDigits: cappedMax,
      };
    } catch {
      // Silently fail
    }
    try {
      const resolved = getCachedNumberFormat(locale, {
        style: 'currency',
        currency,
      }).resolvedOptions();
      return {
        minimumFractionDigits: resolved.minimumFractionDigits,
        maximumFractionDigits: resolved.maximumFractionDigits,
      };
    } catch {
      // Silently fail
    }
  }

  return { minimumFractionDigits: 0, maximumFractionDigits: maximumFractionDigits };
}

export function formatValue(value: number, opts: FormatValueOptions): string {
  const {
    mode,
    decimals,
    minDecimals,
    maxDecimals,
    maximumFractionDigits = 13,
    autoDecimals,
    showCurrency,
    trimZeros,
    compactThreshold,
    signDisplay,
    locale,
    currency,
    currencySymbol,
  } = opts;

  const effectiveMode: FormatMode =
    compactThreshold !== undefined && Math.abs(value) >= compactThreshold ? 'short' : mode;

  const decimalOptions = buildDecimalOptions(
    decimals,
    minDecimals,
    maxDecimals,
    autoDecimals,
    maximumFractionDigits,
    locale,
    currency
  );

  let formatted: string;

  if (effectiveMode === 'full') {
    if (showCurrency && currency) {
      const formatter = getCachedNumberFormat(locale, {
        ...decimalOptions,
        style: 'currency',
        currency,
        signDisplay,
      });
      if (currencySymbol) {
        formatted = formatter
          .formatToParts(value)
          .map(p => (p.type === 'currency' ? currencySymbol : p.value))
          .join('');
      } else {
        formatted = formatter.format(value);
      }
    } else {
      formatted = getCachedNumberFormat(locale, {
        ...decimalOptions,
        style: 'decimal',
        signDisplay,
      }).format(value);
    }
  } else {
    const compactOpts: Intl.NumberFormatOptions = {
      ...decimalOptions,
      notation: 'compact',
      compactDisplay: 'short',
      style: 'decimal',
      signDisplay,
    };
    const compactNumber = getCachedNumberFormat(locale, compactOpts).format(value);

    if (showCurrency && currency) {
      const symbol = currencySymbol ?? getCurrencySymbol(locale, currency);
      formatted = `${symbol}${compactNumber}`;
    } else {
      formatted = compactNumber;
    }
  }

  return trimZeros ? trimTrailingZeros(formatted) : formatted;
}

function buildAriaLabel(
  value: number,
  locale: string,
  showCurrency: boolean,
  currency?: string
): string {
  try {
    if (showCurrency && currency) {
      return getCachedNumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'name',
        notation: 'standard',
      }).format(value);
    }
    return getCachedNumberFormat(locale, { style: 'decimal', notation: 'standard' }).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Encapsula la lógica de formateo numérico para `<Currency />` y `<Num />`.
 *
 * Centraliza el caché de `Intl.NumberFormat`, el formateo según modo y decimales,
 * la eliminación de ceros finales y la construcción del `aria-label` accesible.
 * No opina sobre si el valor es monetario — esa decisión la toma el componente
 * consumidor a través de `showCurrency` y `currency`.
 *
 * Estándares:
 * - **BCP 47** — identificadores de locale para `Intl.NumberFormat`.
 * - **ECMA-402** — `Intl.NumberFormat` controla `style`, `notation`, `signDisplay` y fracciones.
 * - **Unicode CLDR** — separadores, símbolos y nombres de moneda según el locale.
 * - **WCAG 2.1 AA** — `aria-label` siempre en `notation: 'standard'` para evitar que los
 *   screen readers anuncien abreviaciones como `"1.5M"` en lugar del valor completo.
 *
 *
 * @param value - Número a formatear.
 * @param mode - Modo de formateo.
 * @param decimals - Número de decimales.
 * @param minDecimals - Número mínimo de decimales.
 * @param maxDecimals - Número máximo de decimales.
 * @param maximumFractionDigits - Número máximo de fracciones.
 * @param autoDecimals - Auto decimales.
 * @param showCurrency - Mostrar moneda.
 * @param trimZeros - Eliminar ceros finales.
 * @param compactThreshold - Umbral de compacidad.
 * @param signDisplay - Mostrar signo.
 * @param locale - Locale.
 * @param currency - Moneda.
 * @param currencySymbol - Símbolo de moneda.
 * @param prefix - Prefijo.
 * @param suffix - Sufijo.
 * @param ariaLabelOverride - Override del aria-label.
 *
 * @example
 * // Componente monetario
 * const { displayText, ariaLabel, isEmpty } = useNumberFormat({
 *   value: 1500,
 *   mode: 'full',
 *   showCurrency: true,
 *   currency: 'PEN',
 *   locale: 'es-PE',
 * });
 *
 * @example
 * // Componente numérico puro
 * const { displayText, ariaLabel, isEmpty } = useNumberFormat({
 *   value: 84.2,
 *   showCurrency: false,
 *   locale: 'es-PE',
 *   suffix: '%',
 * });
 */
export function useNumberFormat({
  value,
  mode = 'full',
  decimals,
  minDecimals,
  maxDecimals,
  maximumFractionDigits = 13,
  autoDecimals = true,
  showCurrency = false,
  trimZeros = false,
  compactThreshold,
  signDisplay = 'auto',
  locale,
  currency,
  currencySymbol,
  prefix = '',
  suffix = '',
  ariaLabelOverride,
}: UseNumberFormatOptions): UseNumberFormatResult {
  return useMemo(() => {
    if (value == null) return { displayText: '', ariaLabel: '', isEmpty: true };

    const formatted = formatValue(value, {
      mode,
      decimals,
      minDecimals,
      maxDecimals,
      maximumFractionDigits,
      autoDecimals,
      showCurrency,
      trimZeros,
      compactThreshold,
      signDisplay,
      locale,
      currency,
      currencySymbol,
    });

    const displayText = `${prefix}${formatted}${suffix}`;
    const ariaLabel = ariaLabelOverride ?? buildAriaLabel(value, locale, showCurrency, currency);

    return { displayText, ariaLabel, isEmpty: false };
  }, [
    value,
    mode,
    decimals,
    minDecimals,
    maxDecimals,
    maximumFractionDigits,
    autoDecimals,
    showCurrency,
    trimZeros,
    compactThreshold,
    signDisplay,
    locale,
    currency,
    currencySymbol,
    prefix,
    suffix,
    ariaLabelOverride,
  ]);
}
