/**
 * useClickOutside hook - Detects clicks outside a referenced element
 * Useful for modals, dropdowns, etc.
 */

import { useEffect, useRef, RefObject } from 'react';

function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick as unknown as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick as unknown as EventListener);
    };
  }, [callback]);

  return ref;
}

export default useClickOutside;
