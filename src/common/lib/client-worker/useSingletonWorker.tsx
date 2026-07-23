import { useEffect, useRef } from 'react';

import { Remote, releaseProxy, wrap } from 'comlink';

interface Props {
  worker: () => Worker;
  group: string;
}

const registry = new Map<string, { proxy: Remote<any>; instance: Worker; refCount: number }>();

const useSingletonWorker = <T = any,>({ worker, group }: Props) => {
  const workerRef = useRef<Remote<T> | null>(null);
  const workerInstanceRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!registry.has(group)) {
      const instance = worker();
      registry.set(group, { proxy: wrap<T>(instance), instance, refCount: 0 });
    }

    const entry = registry.get(group)!;
    entry.refCount++;
    workerRef.current = entry.proxy as Remote<T>;
    workerInstanceRef.current = entry.instance;

    return () => {
      const entry = registry.get(group)!;
      entry.refCount--;

      if (entry.refCount === 0) {
        entry.proxy[releaseProxy]();
        entry.instance.terminate();
        registry.delete(group);
      }

      workerRef.current = null;
      workerInstanceRef.current = null;
    };
  }, [group, worker]);

  return { workerRef, workerInstanceRef };
};

export default useSingletonWorker;
