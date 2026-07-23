import type { EventsType, IIdleTimer, PresenceType } from 'react-idle-timer';

import type { IdleTimerDuration } from './idle-timer.constants';

export type { EventsType, IIdleTimer, PresenceType };

export type IdleTimerPromptState = {
  isActive: boolean;
  secondsLeft: number | null;
};

export interface UseIdleTimerProps {
  timeout: IdleTimerDuration;
  onIdle: () => void;
  onActive?: () => void;
  onPrompt?: () => void;
  promptBeforeIdle?: IdleTimerDuration;
  trackPrompt?: boolean;
  onPresenceChange?: (presence: PresenceType) => void;
  trackPresence?: boolean;
  crossTab?: boolean;
  syncTimers?: IdleTimerDuration;
  leaderElection?: boolean;
  useWorkerTimers?: boolean;
  events?: EventsType[];
  immediateEvents?: EventsType[];
  eventsThrottle?: IdleTimerDuration;
  element?: Document | HTMLElement;
  stopOnIdle?: boolean;
  onMessage?: (data: string | number | object) => void;
  disabled?: boolean;
  name?: string;
}

export type UseIdleTimerReturnWithPrompt = {
  timer: IIdleTimer;
  prompt: IdleTimerPromptState;
};
