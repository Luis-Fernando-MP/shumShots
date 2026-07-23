import { useEffect, useRef } from 'react';

import { Remote, releaseProxy, wrap } from 'comlink';

interface Props {
  worker: () => Worker;
}

const useWorker = <T = any>({ worker }: Props) => {
  const workerRef = useRef<Remote<T> | null>(null);
  const workerInstanceRef = useRef<Worker | null>(null);

  useEffect(() => {
    const instance = worker();
    workerRef.current = wrap<T>(instance);
    workerInstanceRef.current = instance;

    return () => {
      workerRef.current?.[releaseProxy]();
      workerInstanceRef.current?.terminate();
      workerRef.current = null;
      workerInstanceRef.current = null;
    };
  }, [worker]);

  return { workerRef, workerInstanceRef };
};

export default useWorker;
