import equal from 'fast-deep-equal';
import { useRef, useEffect } from 'react';

/**
 * Ensures the function passed as an argument is executed once each time the dependency changes.
 */
export function useRunOnChange<T>(fn: (prevValue: T | null) => unknown, value: T) {
  const hasRun = useRef(false);
  const valueRef = useRef<T | null>(null);
  const prevValueRef = useRef<T | null>(null);

  useEffect(() => {
    if (!equal(value, valueRef.current)) {
      prevValueRef.current = valueRef.current;
      valueRef.current = value;
      hasRun.current = false;
    }
  }, [value]);

  useEffect(() => {
    if (!hasRun.current && valueRef.current !== null) {
      fn(prevValueRef.current);
      hasRun.current = true;
    }
  });
}
