import React, { type FC, type TimeHTMLAttributes, memo, useMemo } from 'react';

import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/pt';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.extend(dayOfYear);

const DEFAULT_TIMEZONE: string = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
})();

const DEFAULT_LOCALE: string = (() => {
  try {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.split('-')[0] || 'es';
    }
  } catch {}
  return 'es';
})();

const SUPPORTED_LOCALES = new Set(['de', 'en', 'es', 'fr', 'pt']);

function resolveLocale(locale?: string): string {
  if (!locale) return DEFAULT_LOCALE;
  const base = locale.split('-')[0]?.toLowerCase() || '';
  return SUPPORTED_LOCALES.has(base) ? base : DEFAULT_LOCALE;
}

export type DateInput = string | number | Date | Dayjs | null | undefined;
export type DateMode = 'full' | 'date' | 'time' | 'datetime' | 'relative' | 'custom';
export type DatePrecision = 'year' | 'month' | 'day' | 'minute' | 'second';

export interface DateFormatProps extends TimeHTMLAttributes<HTMLTimeElement> {
  date: DateInput;
  mode?: DateMode;
  format?: string;
  timezone?: string;
  tz?: string;
  locale?: string;
  precision?: DatePrecision;
  hour12?: boolean;
  fallbackText?: string;
  fallback?: string;
  prefix?: string;
  suffix?: string;
  ariaLabel?: string;
  label?: string;
}

const PRECISION_RANK: Record<DatePrecision, number> = {
  year: 0,
  month: 1,
  day: 2,
  minute: 3,
  second: 4,
};

const MODE_REQUIRED_PRECISION: Partial<Record<DateMode, DatePrecision>> = {
  time: 'minute',
  datetime: 'minute',
};

const MODE_FORMATS: Record<Exclude<DateMode, 'relative' | 'custom'>, string> = {
  full: 'LL',
  date: 'DD/MM/YYYY',
  time: 'HH:mm',
  datetime: 'DD/MM/YYYY HH:mm',
};

/**
 * Formatos degradados para cuando el input no tiene suficiente precisión
 * pero el mode aún puede mostrar algo significativo.
 * Se usan tokens dayjs que dayjs localiza automáticamente según el locale activo —
 * no contienen literales de lenguaje natural hardcodeados.
 */
const DEGRADED_FORMATS: Partial<Record<DateMode, Partial<Record<DatePrecision, string>>>> = {
  date: {
    year: 'YYYY',
    month: 'MM/YYYY',
  },
  full: {
    year: 'YYYY',
    month: 'MMMM YYYY',
  },
  datetime: {
    year: 'YYYY',
    month: 'MM/YYYY',
    day: 'DD/MM/YYYY',
  },
};

/**
 * Parsea cualquier representación de fecha a Dayjs.
 *
 * Soporta:
 * - ISO 8601: YYYY, YYYY-MM, YYYY-MM-DD, YYYY-MM-DDTHH:mm[:ss][Z]
 * - Día ordinal ISO 8601: YYYY-DDD (e.g. '2026-123' → 3 de mayo de 2026)
 * - Unix timestamp en segundos (≤10 dígitos) o milisegundos
 * - Date nativo y Dayjs
 *
 * Rechaza:
 * - Semanas ISO (YYYY-Www): formato ambiguo sin soporte nativo
 * - Componentes fuera de rango (mes 13, día 32…)
 * - Overflow silencioso de dayjs (guard post-parse)
 * - Objetos no primitivos
 */
function parseDateInput(value: DateInput): Dayjs | null {
  if (value === null || value === undefined || value === '') return null;

  if (typeof value === 'object' && !dayjs.isDayjs(value) && !(value instanceof Date)) {
    return null;
  }

  if (dayjs.isDayjs(value)) return value.isValid() ? value : null;

  if (value instanceof Date) {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }

  if (typeof value === 'number') {
    if (!isFinite(value) || isNaN(value)) return null;
    return dayjs(value < 1e12 ? value * 1000 : value);
  }

  if (typeof value === 'string') {
    if (/^\d{4}-W\d{2}/.test(value)) return null;

    const ordinalMatch = value.match(/^(\d{4})-(\d{3})$/);
    if (ordinalMatch) {
      const yearStr = ordinalMatch[1];
      const doyStr = ordinalMatch[2];
      if (!yearStr || !doyStr) return null;

      const year = parseInt(yearStr, 10);
      const doy = parseInt(doyStr, 10);
      if (doy < 1 || doy > 366) return null;
      const parsed = dayjs(`${year}-01-01`).dayOfYear(doy);
      return parsed.isValid() && parsed.year() === year ? parsed : null;
    }

    const isoDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
      const monthStr = isoDateMatch[2];
      const dayStr = isoDateMatch[3];
      if (!monthStr || !dayStr) return null;

      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      if (month < 1 || month > 12 || day < 1 || day > 31) return null;
      const parsed = dayjs(value);
      if (!parsed.isValid()) return null;
      if (parsed.month() + 1 !== month || parsed.date() !== day) return null;
      return parsed;
    }

    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }

  return null;
}

/**
 * Detecta el nivel de precisión real del dato según ISO 8601 §4.1.
 * Solo strings ISO son inspeccionables — timestamps, Date y Dayjs asumen `"second"`.
 */
function detectPrecision(value: DateInput): DatePrecision {
  if (typeof value !== 'string') return 'second';
  if (/^\d{4}$/.test(value)) return 'year';
  if (/^\d{4}-\d{2}$/.test(value)) return 'month';
  if (/^\d{4}-\d{3}$/.test(value)) return 'day';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'day';
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return 'minute';
  return 'second';
}

/**
 * Construye el atributo `dateTime` del `<time>` truncado a la precisión real del dato,
 * siguiendo ISO 8601 §4.1 — nunca inventa componentes ausentes en el valor original.
 */
function buildDateTimeAttr(zoned: Dayjs, precision: DatePrecision): string {
  switch (precision) {
    case 'year':
      return zoned.format('YYYY');
    case 'month':
      return zoned.format('YYYY-MM');
    case 'day':
      return zoned.format('YYYY-MM-DD');
    case 'minute':
      return zoned.format('YYYY-MM-DDTHH:mmZ');
    default:
      return zoned.toISOString();
  }
}

/**
 * Convierte la parte horaria del texto ya formateado a 12h o 24h via `Intl.DateTimeFormat`
 * (Unicode TR#35 §4, opción `hour12`). Solo actúa cuando `hour12` es explícito.
 */
function applyHour12(text: string, nativeDate: Date, locale: string, hour12: boolean): string {
  try {
    const time = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12,
    }).format(nativeDate);

    return time ? text.replace(/\d{1,2}:\d{2}(?:\s?[APap][Mm])?/, time) : text;
  } catch {
    return text;
  }
}

/**
 * Resuelve la zona horaria: usa la indicada si es válida, cae a la del sistema en
 * caso contrario (zona IANA inválida o no reconocida por el motor JS).
 */
function resolveTimezone(tz?: string): string {
  if (!tz) return DEFAULT_TIMEZONE;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

function resolveFormat(
  mode: DateMode,
  format: string | undefined,
  precision: DatePrecision
): string | null {
  if (mode === 'relative') return null;
  if (mode === 'custom') return format ?? null;

  const required = MODE_REQUIRED_PRECISION[mode];
  if (required && PRECISION_RANK[precision] < PRECISION_RANK[required]) {
    return null;
  }

  const degraded = DEGRADED_FORMATS[mode]?.[precision];
  if (degraded !== undefined) return degraded;

  return MODE_FORMATS[mode];
}

const MODES_WITH_TIME: Set<DateMode> = new Set(['time', 'datetime', 'custom']);

function formatDate(
  parsed: Dayjs,
  mode: DateMode,
  format: string | undefined,
  tz: string,
  locale: string,
  precision: DatePrecision,
  hour12: boolean | undefined
): string | null {
  const zoned = parsed.tz(tz).locale(locale);

  if (mode === 'relative') return zoned.fromNow();

  const template = resolveFormat(mode, format, precision);
  if (template === null) return null;

  const result = zoned.format(template);

  if (hour12 !== undefined && MODES_WITH_TIME.has(mode)) {
    return applyHour12(result, zoned.toDate(), locale, hour12);
  }

  return result;
}

function buildAriaLabel(zoned: Dayjs, precision: DatePrecision, locale: string): string {
  const z = zoned.locale(locale);
  switch (precision) {
    case 'year':
      return z.format('YYYY');
    case 'month':
      return z.format('MMMM YYYY');
    case 'day':
      return z.format('LL');
    case 'minute':
      return z.format('LLL');
    default:
      return z.format('LLLL');
  }
}

interface Computed {
  displayText: string;
  ariaLabel: string;
  dateTimeAttr: string;
  valid: boolean;
}

const FALLBACK_COMPUTED = (text: string): Computed => ({
  displayText: text,
  ariaLabel: '',
  dateTimeAttr: '',
  valid: false,
});

/**
 * Renderiza una fecha como elemento semántico `<time>` (HTML Living Standard §4.5.14),
 * con transformación, normalización y localización completas.
 *
 * ### Props / aliases
 *
 * | Prop corta | Alias de        | Descripción                                      |
 * |------------|-----------------|--------------------------------------------------|
 * | `tz`       | `timezone`      | Zona horaria IANA. `timezone` tiene precedencia. |
 * | `fallback` | `fallbackText`  | Texto fallback. `fallbackText` tiene precedencia. |
 * | `label`    | `ariaLabel`     | `aria-label` custom. `ariaLabel` tiene precedencia. |
 *
 * ### Comportamiento de precisión
 * El componente detecta automáticamente la precisión del input (año, mes, día, minuto, segundo)
 * y aplica reglas estrictas para evitar inventar componentes ausentes:
 * - `time` y `datetime` requieren precisión mínima de minuto → fallback si el input es solo fecha.
 * - `date` con precisión `month` muestra `MM/YYYY`; con precisión `year` muestra `YYYY`.
 * - `full` con precisión `month` muestra `MMMM YYYY` localizado; con `year` muestra solo `YYYY`.
 * - `datetime` con precisión `day` muestra solo la fecha sin hora inventada.
 * - `relative` siempre funciona independientemente de la precisión.
 * - `custom` delega la responsabilidad del formato al caller; sin `format` → fallback.
 *
 * ### Robustez
 * - **Ordinal ISO 8601**: `'2026-123'` se parsea como el día 123 del año (3 de mayo de 2026).
 * - **Semanas ISO**: `'2026-W05'` retorna fallback (formato ambiguo).
 * - **Anti-overflow ISO**: `'2024-99-99'` retorna fallback sin desbordarse.
 * - **Locale inválido**: cae al `DEFAULT_LOCALE` silenciosamente.
 * - **Timezone inválida**: cae a la zona del sistema silenciosamente.
 * - **Objetos planos**: retornan fallback sin crash.
 *
 * @param date              - Fecha a renderizar. Acepta ISO 8601, ordinal YYYY-DDD, Unix timestamp (s o ms), `Date` o `Dayjs`.
 * @param mode              - Formato de visualización: `"date"` · `"time"` · `"datetime"` · `"full"` · `"relative"` · `"custom"`.
 * @param format            - Tokens dayjs para `mode="custom"`. Sin este prop en modo custom → fallback.
 * @param timezone          - Zona horaria IANA. Tiene precedencia sobre `tz`.
 * @param tz                - Alias corto de `timezone`.
 * @param locale            - Locale BCP 47. Locales no cargados caen al default.
 * @param precision         - Nivel de precisión ISO 8601 §4.1. Se detecta automáticamente.
 * @param hour12            - `true` fuerza 12h, `false` fuerza 24h. Sin pasar → el locale decide.
 * @param fallbackText      - Texto plano para fechas nulas/inválidas. Tiene precedencia sobre `fallback`.
 * @param fallback          - Alias corto de `fallbackText`.
 * @param prefix            - Texto decorativo antes de la fecha. `aria-hidden`.
 * @param suffix            - Texto decorativo después de la fecha. `aria-hidden`.
 * @param ariaLabel         - Sobreescribe el `aria-label` generado. Tiene precedencia sobre `label`.
 * @param label             - Alias corto de `ariaLabel`.
 *
 * @example
 * <DateFormat date="2026-05-15" tz="America/Lima" />
 *
 * @example
 * <DateFormat date={null} fallback="Pendiente" />
 *
 * @example
 * <DateFormat date="2026-123" mode="date" />
 *
 * @example
 * <DateFormat date="2026-05" mode="date" /> // → "05/2026" (no inventa el día)
 *
 * @example
 * <DateFormat date="2026-05-15T14:30" mode="time" hour12={true} /> // → "2:30 PM"
 */
const DateFormatComponent: FC<DateFormatProps> = ({
  date,
  mode = 'date',
  format,
  timezone: tzProp,
  tz: tzAlias,
  locale: localeProp,
  precision: precisionProp,
  hour12,
  fallbackText,
  fallback,
  prefix,
  suffix,
  ariaLabel: ariaLabelOverride,
  label,
  ...timeProps
}) => {
  const effectiveFallback = fallbackText ?? fallback ?? '-';
  const effectiveAriaLabel = ariaLabelOverride ?? label;

  const tz = useMemo(() => resolveTimezone(tzProp ?? tzAlias), [tzProp, tzAlias]);
  const locale = useMemo(() => resolveLocale(localeProp), [localeProp]);

  const computed = useMemo<Computed>(() => {
    if (date === null || date === undefined || date === '') {
      return FALLBACK_COMPUTED(effectiveFallback);
    }

    const parsed = parseDateInput(date);
    if (!parsed?.isValid()) return FALLBACK_COMPUTED(effectiveFallback);

    const precision = precisionProp ?? detectPrecision(date);
    const zoned = parsed.tz(tz).locale(locale);

    const displayText = formatDate(parsed, mode, format, tz, locale, precision, hour12);
    if (displayText === null) return FALLBACK_COMPUTED(effectiveFallback);

    const dateTimeAttr = buildDateTimeAttr(zoned, precision);
    const ariaLabel = effectiveAriaLabel ?? buildAriaLabel(zoned, precision, locale);

    return { displayText, ariaLabel, dateTimeAttr, valid: true };
  }, [
    date,
    mode,
    format,
    tz,
    locale,
    precisionProp,
    hour12,
    effectiveFallback,
    effectiveAriaLabel,
  ]);

  if (!computed.valid) {
    return (
      <span {...(timeProps as React.HTMLAttributes<HTMLSpanElement>)}>{computed.displayText}</span>
    );
  }

  return (
    <time {...timeProps} dateTime={computed.dateTimeAttr} aria-label={computed.ariaLabel}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {computed.displayText}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </time>
  );
};

export const DateFormat = memo(DateFormatComponent);
