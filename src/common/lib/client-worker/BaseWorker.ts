import { type Endpoint, expose, proxy } from 'comlink';

export enum WorkerStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  WORKING = 'WORKING',
  TERMINATED = 'TERMINATED',
  ERROR = 'ERROR',
}

type StatusListener = (status: WorkerStatus, key: string) => void;
type BroadcastListener = (status: WorkerStatus) => void;

abstract class BaseWorker {
  status: Record<string, WorkerStatus> = {};
  private listeners: Map<string, StatusListener[]> = new Map();
  private broadcastListeners: BroadcastListener[] = [];

  constructor(endpoint?: Endpoint, allowedOrigins?: (string | RegExp)[]) {
    expose(this, endpoint, allowedOrigins);
  }

  protected setStatus(key: string, status: WorkerStatus) {
    this.status[key] = status;
    const keyListeners = this.listeners.get(key);
    if (keyListeners) for (const cb of keyListeners) cb(status, key);
  }

  protected setBroadcastStatus(status: WorkerStatus) {
    for (const cb of this.broadcastListeners) cb(status);
  }

  subscribeStatus(key: string, cb: StatusListener) {
    const list = this.listeners.get(key);
    if (list) list.push(cb);
    else this.listeners.set(key, [cb]);
  }

  subscribeBroadcastStatus(cb: BroadcastListener) {
    this.broadcastListeners.push(cb);
  }

  unsubscribeStatus(key: string, cb: StatusListener) {
    const list = this.listeners.get(key);
    if (!list) return;
    const i = list.indexOf(cb);
    if (i !== -1) list.splice(i, 1);
  }

  unsubscribeStatusBroadcast(cb: BroadcastListener) {
    const i = this.broadcastListeners.indexOf(cb);
    if (i !== -1) this.broadcastListeners.splice(i, 1);
  }

  getStatuses(): Record<string, WorkerStatus> {
    return { ...this.status };
  }
}

export default BaseWorker;
export { proxy as wkProxy };
