import { useState, useEffect, useCallback } from 'react';
import {
  isConsentGranted as gtagIsConsentGranted,
  setConsent,
  toggleConsent as gtagToggleConsent,
} from '../lib/analytics/gtag';
import { CONSENT_STORAGE_KEY } from '../lib/analytics/gtag';

export function useAnalyticsConsent() {
  const [granted, setGranted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const v = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (v === 'denied') return false;
      return true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CONSENT_STORAGE_KEY) return;
      setGranted(e.newValue !== 'denied');
    };
    const onCustom = () => setGranted(gtagIsConsentGranted());
    window.addEventListener('storage', onStorage);
    window.addEventListener('analytics_consent_change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('analytics_consent_change', onCustom);
    };
  }, []);

  const update = useCallback((value: boolean) => {
    setConsent(value);
    setGranted(value);
    try {
      window.dispatchEvent(new Event('analytics_consent_change'));
    } catch {
      /* noop */
    }
  }, []);

  const toggle = useCallback(() => {
    const next = gtagToggleConsent();
    setGranted(next);
    try {
      window.dispatchEvent(new Event('analytics_consent_change'));
    } catch {
      /* noop */
    }
    return next;
  }, []);

  return {
    granted,
    setGranted: update,
    toggle,
  };
}

export default useAnalyticsConsent;
