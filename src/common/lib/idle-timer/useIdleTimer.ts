'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_EVENTS,
  type IIdleTimer,
  useIdleTimer as useReactIdleTimer,
  workerTimers,
} from 'react-idle-timer';

import { TIMER_MAP, resolveTimerDuration } from './idle-timer.constants';
import type { UseIdleTimerProps, UseIdleTimerReturnWithPrompt } from './idle-timer.types';

const PRESENCE_EVENT = 'visibilitychange';

function useIdleTimer({
  timeout,
  onIdle,
  onActive,
  onPrompt,
  promptBeforeIdle = TIMER_MAP['10s'],
  trackPrompt = false,
  onPresenceChange,
  trackPresence = false,
  crossTab = true,
  syncTimers,
  leaderElection = true,
  useWorkerTimers = true,
  events,
  immediateEvents,
  eventsThrottle = 500,
  element,
  stopOnIdle = false,
  onMessage,
  disabled = false,
  name,
}: UseIdleTimerProps): IIdleTimer | UseIdleTimerReturnWithPrompt {
  const resolvedSyncTimers =
    syncTimers !== undefined ? resolveTimerDuration(syncTimers) : crossTab ? 200 : 0;

  const resolvedEvents =
    events ?? (trackPresence ? undefined : DEFAULT_EVENTS.filter(e => e !== PRESENCE_EVENT));

  const resolvedPromptBeforeIdle = resolveTimerDuration(promptBeforeIdle);
  const totalSeconds = Math.ceil(resolvedPromptBeforeIdle / 1000);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<IIdleTimer | null>(null);

  const clearCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearCountdown();
    if (totalSeconds <= 0) {
      setSecondsLeft(null);
      return;
    }

    let current = totalSeconds;
    setSecondsLeft(current);

    intervalRef.current = setInterval(() => {
      current -= 1;
      if (current <= 0) {
        clearCountdown();
        setSecondsLeft(null);
        return;
      }
      setSecondsLeft(current);
    }, 1000);
  }, [totalSeconds, clearCountdown]);

  const handlePrompt = useCallback(() => {
    if (trackPrompt) startCountdown();
    onPrompt?.();
  }, [trackPrompt, startCountdown, onPrompt]);

  const handleActive = useCallback(() => {
    if (trackPrompt) {
      clearCountdown();
      setSecondsLeft(null);
    }
    onActive?.();
  }, [trackPrompt, clearCountdown, onActive]);

  const handleIdle = useCallback(() => {
    if (trackPrompt) {
      clearCountdown();
      setSecondsLeft(null);
    }
    onIdle();
  }, [trackPrompt, clearCountdown, onIdle]);

  useEffect(() => clearCountdown, [clearCountdown]);

  const timer = useReactIdleTimer({
    timeout: resolveTimerDuration(timeout),
    promptBeforeIdle: resolvedPromptBeforeIdle,
    disabled,
    stopOnIdle,
    crossTab,
    syncTimers: resolvedSyncTimers,
    leaderElection: crossTab ? leaderElection : false,
    name,
    element,
    events: resolvedEvents,
    immediateEvents,
    timers: useWorkerTimers ? workerTimers : undefined,
    eventsThrottle: resolveTimerDuration(eventsThrottle),
    onIdle: handleIdle,
    onActive: handleActive,
    onPrompt: resolvedPromptBeforeIdle > 0 || onPrompt || trackPrompt ? handlePrompt : undefined,
    onPresenceChange: trackPresence ? onPresenceChange : undefined,
    onMessage,
  });

  timerRef.current = timer;

  useEffect(() => {
    if (disabled) return;

    const cancelPromptOnActivity = () => {
      if (timerRef.current?.isPrompted()) {
        timerRef.current.activate();
      }
    };

    const targetEvents = resolvedEvents ?? DEFAULT_EVENTS;
    const target = element ?? document;

    targetEvents.forEach(event => {
      target.addEventListener(event, cancelPromptOnActivity, { passive: true });
    });

    return () => {
      targetEvents.forEach(event => {
        target.removeEventListener(event, cancelPromptOnActivity);
      });
    };
  }, [disabled, resolvedEvents, element]);

  if (trackPrompt) {
    return {
      timer,
      prompt: {
        isActive: timer.isPrompted(),
        secondsLeft,
      },
    };
  }

  return timer;
}

export default useIdleTimer;
