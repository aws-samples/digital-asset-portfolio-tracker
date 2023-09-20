import { useRef, useEffect, useLayoutEffect } from 'react';

type UseRunOnceOptions = { layoutEffect?: boolean; onDestroy?: null | (() => any) };

/**
 * Ensures the function passed as an argument is only executed once during the callers lifetime.
 */
export function useRunOnce<T>(fn: () => T, options?: UseRunOnceOptions) {
  const hasRun = useRef(false);

  const { layoutEffect, onDestroy } = {
    layoutEffect: false,
    onDestroy: null,
    ...options
  };

  const effect = layoutEffect ? useLayoutEffect : useEffect;

  effect(() => {
    if (!hasRun.current) {
      fn();
      hasRun.current = true;
    }

    if (onDestroy) {
      return onDestroy;
    }
  }, []);
}
