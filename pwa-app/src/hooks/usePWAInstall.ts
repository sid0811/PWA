import {useState, useEffect, useCallback} from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

interface PWAInstallState {
  isInstalled: boolean;
  isInstallable: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  promptInstall: () => Promise<void>;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

export const usePWAInstall = (): PWAInstallState => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  // Detect platform
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);

  const getPlatform = (): 'ios' | 'android' | 'desktop' | 'unknown' => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) return 'desktop';
    return 'unknown';
  };

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true || // iOS Safari
        document.referrer.includes('android-app://');

      setIsInstalled(isStandalone);

      if (isStandalone) {
        console.log('PWA: App is running in standalone mode (installed)');
      }
    };

    checkInstalled();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('PWA: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('PWA: App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    // For iOS, check if it's Safari and not installed
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      // iOS Safari can install PWA but doesn't fire beforeinstallprompt
      // We can show instructions for iOS users
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isIOS]);

  const promptInstall = useCallback(async () => {
    if (isIOS) {
      // For iOS, show instructions since beforeinstallprompt is not supported
      alert(
        'To install this app on your iPhone/iPad:\n\n' +
        '1. Tap the Share button (square with arrow)\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" in the top right corner'
      );
      return;
    }

    if (!deferredPrompt) {
      console.log('PWA: No deferred prompt available');
      return;
    }

    try {
      deferredPrompt.prompt();
      const {outcome} = await deferredPrompt.userChoice;
      console.log(`PWA: User ${outcome} the install prompt`);

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }

      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('PWA: Error during install prompt:', error);
    }
  }, [deferredPrompt, isIOS]);

  return {
    isInstalled,
    isInstallable,
    isIOS,
    isAndroid,
    platform: getPlatform(),
    promptInstall,
    deferredPrompt,
  };
};

export default usePWAInstall;
