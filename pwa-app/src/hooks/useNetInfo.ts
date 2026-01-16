import { useEffect, useState } from 'react';

export const useNetInfo = () => {
  const [isNetConnected, setIsNetConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Set initial state
    setIsNetConnected(navigator.onLine);

    const handleOnline = () => {
    //   console.log('Is connected?', true);
      setIsNetConnected(true);
    };

    const handleOffline = () => {
    //   console.log('Is connected?', false);
      setIsNetConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isNetConnected
  };
};
