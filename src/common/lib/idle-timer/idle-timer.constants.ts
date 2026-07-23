const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export const TIMER_MAP = {
  '5s': 5 * SECOND,
  '10s': 10 * SECOND,
  '15s': 15 * SECOND,
  '20s': 20 * SECOND,
  '25s': 25 * SECOND,
  '30s': 30 * SECOND,

  '1m': 1 * MINUTE,
  '2m': 2 * MINUTE,
  '3m': 3 * MINUTE,
  '5m': 5 * MINUTE,
  '10m': 10 * MINUTE,
  '15m': 15 * MINUTE,
  '30m': 30 * MINUTE,
  '45m': 45 * MINUTE,

  '1h': 1 * HOUR,
  '90m': 90 * MINUTE,
  '2h': 2 * HOUR,
  '4h': 4 * HOUR,
  '6h': 6 * HOUR,
  '8h': 8 * HOUR,
  '12h': 12 * HOUR,
  '1d': 24 * HOUR,
} as const;

export type IdleTimerPresetKey = keyof typeof TIMER_MAP;

export type IdleTimerDuration = number | IdleTimerPresetKey;

export const resolveTimerDuration = (duration: IdleTimerDuration): number =>
  typeof duration === 'number' ? duration : TIMER_MAP[duration];
