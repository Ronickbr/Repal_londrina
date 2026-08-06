export const FALLBACK_MEASUREMENT_ID = 'G-X95YSNPVGD';
export const CONSENT_STORAGE_KEY = 'analytics_consent';

type GtagEventParams = Record<string, unknown>;

interface BufferedCall {
  type: 'config' | 'event' | 'consent' | 'set';
  args: unknown[];
}

export interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __gtag_fallback_id?: string;
  __gtag_debug?: boolean;
  [key: `ga-disable-${string}`]: boolean | undefined;
}

const w: GtagWindow = (typeof globalThis !== 'undefined' ? globalThis : {}) as unknown as GtagWindow;

let currentMeasurementId: string | null = w.__gtag_fallback_id || null;
let initialized = false;
let dataLayerRef: unknown[] | null = null;
let bufferedCalls: BufferedCall[] = [];
let conflictDetected = false;

const isBrowser: boolean = typeof window !== 'undefined';

function getDebugEnabledFromUrl(): boolean {
  if (!isBrowser) return false;
  try {
    if (typeof w.__gtag_debug === 'boolean') return w.__gtag_debug;
    return /[?&]gtag_debug=true/.test(window.location.search);
  } catch {
    return false;
  }
}

const isEnvDev = (): boolean => {
  try {
    return import.meta.env?.DEV === true;
  } catch {
    return false;
  }
};

export function isDebugEnabled(): boolean {
  return isEnvDev() || getDebugEnabledFromUrl();
}

function logDebug(tag: string, ...args: unknown[]): void {
  if (!isDebugEnabled()) return;
  // eslint-disable-next-line no-console
  console.debug(`[gtag:${tag}]`, ...args);
}

function logWarn(tag: string, ...args: unknown[]): void {
  if (!isDebugEnabled()) return;
  // eslint-disable-next-line no-console
  console.warn(`[gtag:${tag}]`, ...args);
}

function logError(tag: string, ...args: unknown[]): void {
  // eslint-disable-next-line no-console
  console.error(`[gtag:${tag}]`, ...args);
}

function getGtag(): ((...a: unknown[]) => void) | null {
  return typeof w.gtag === 'function' ? w.gtag : null;
}

function getDataLayer(): unknown[] | null {
  const dl = w.dataLayer;
  if (!Array.isArray(dl)) return null;
  if (typeof dl.push !== 'function') return null;
  return dl;
}

function checkAndRestoreDataLayer(): boolean {
  if (!isBrowser) return false;
  const dl = w.dataLayer;
  if (Array.isArray(dl) && typeof dl.push === 'function') {
    if (!dataLayerRef) dataLayerRef = dl;
    else if (dataLayerRef !== dl && !conflictDetected) {
      conflictDetected = true;
      logWarn('conflict', 'window.dataLayer foi sobrescrito por outra biblioteca. Tentando continuar.');
      dataLayerRef = dl;
    }
    return true;
  }
  if (!conflictDetected) {
    conflictDetected = true;
    logWarn('conflict', 'window.dataLayer está inválido. Reinicializando...');
  }
  w.dataLayer = dataLayerRef && Array.isArray(dataLayerRef) ? dataLayerRef : [];
  dataLayerRef = w.dataLayer;
  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag(...a: unknown[]) {
      (w.dataLayer as unknown[]).push(a);
    };
  }
  return true;
}

export function isConsentGranted(): boolean {
  if (!isBrowser) return true;
  try {
    const v = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (v === 'denied') return false;
    return true;
  } catch {
    return true;
  }
}

function getIdList(): string[] {
  const ids: string[] = [];
  if (currentMeasurementId) ids.push(currentMeasurementId);
  if (w.__gtag_fallback_id && !ids.includes(w.__gtag_fallback_id)) {
    ids.push(w.__gtag_fallback_id);
  }
  return ids;
}

function updateDisableFlags(granted: boolean): void {
  if (!isBrowser) return;
  for (const id of getIdList()) {
    const key = `ga-disable-${id}` as const;
    w[key] = granted ? false : true;
  }
}

export function isLoaded(): boolean {
  if (!isBrowser) return false;
  if (!initialized) return false;
  return !!getGtag() && !!getDataLayer();
}

export function getCurrentMeasurementId(): string | null {
  return currentMeasurementId;
}

function flushBufferedCalls(): void {
  if (!bufferedCalls.length) return;
  const calls = bufferedCalls;
  bufferedCalls = [];
  for (const call of calls) {
    executeCall(call.type, ...call.args);
  }
}

function executeCall(type: BufferedCall['type'], ...args: unknown[]): void {
  if (!checkAndRestoreDataLayer()) return;
  const gtag = getGtag();
  if (!gtag) {
    bufferedCalls.push({ type, args });
    return;
  }
  if (type === 'event' || type === 'config') {
    if (!isConsentGranted()) {
      logDebug(type === 'event' ? 'event' : 'config', 'bloqueado por opt-out:', args[0]);
      return;
    }
  }
  try {
    gtag(type as any, ...args);
  } catch (err) {
    logError('execute_error', err);
  }
}

function validateScriptLoad(id: string): void {
  if (!isBrowser || typeof document === 'undefined') return;
  const expectedUrl = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  const check = () => {
    try {
      const entries = (performance?.getEntriesByName?.(expectedUrl) || []) as Array<{ initiatorType?: string; duration?: number }>;
      if (entries.length > 0) {
        logDebug('load_ok', expectedUrl, entries[0]);
        return;
      }
      const scriptFound = Array.from(document.querySelectorAll('script[src]')).some(
        (s) => (s as HTMLScriptElement).src.includes('googletagmanager.com/gtag/js')
      );
      if (scriptFound) {
        logDebug('load_ok', 'script tag presente no DOM');
        return;
      }
      logWarn('load_failed', `não foi possível confirmar o carregamento de ${expectedUrl}`);
    } catch (err) {
      logWarn('load_check_error', err);
    }
  };
  if (typeof setTimeout === 'function') {
    setTimeout(check, 5000);
  }
}

export function initGtag(measurementId?: string, options?: { debug?: boolean }): void {
  if (!isBrowser) return;
  checkAndRestoreDataLayer();
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  if (typeof w.gtag !== 'function') {
    w.gtag = function gtag(...a: unknown[]) {
      (w.dataLayer as unknown[]).push(a);
    };
  }
  dataLayerRef = w.dataLayer;

  let id: string;
  if (measurementId && measurementId.trim()) {
    id = measurementId.trim();
  } else {
    id = currentMeasurementId || w.__gtag_fallback_id || FALLBACK_MEASUREMENT_ID;
  }
  currentMeasurementId = id;

  const debug = options?.debug === true || isDebugEnabled();

  updateDisableFlags(isConsentGranted());

  if (typeof document !== 'undefined' && !document.getElementById('gtag-script-src')) {
    const s = document.createElement('script');
    s.id = 'gtag-script-src';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s.onerror = () => logError('load_failed', `erro de rede/CORS ao carregar gtag.js para ${id}`);
    document.head.appendChild(s);
  }

  if (!initialized) {
    executeCall('set', 'js', new Date());
    initialized = true;
  }

  const configParams: GtagEventParams = {};
  if (debug) configParams.debug_mode = true;
  executeCall('config', id, configParams);

  validateScriptLoad(id);
  flushBufferedCalls();

  logDebug('init', id, { debug, consent: isConsentGranted() });
}

export function trackPageView(path?: string, title?: string): void {
  if (!isBrowser) return;
  if (!initialized) initGtag();
  const p = path || window.location.pathname + window.location.search;
  const t = title || (typeof document !== 'undefined' ? document.title : '');
  const params: GtagEventParams = {
    page_path: p,
    page_title: t,
  };
  if (typeof window !== 'undefined') params.page_location = window.location.href;
  if (currentMeasurementId) params.send_to = currentMeasurementId;
  executeCall('event', 'page_view', params);
  logDebug('page_view', p, t);
}

export function trackEvent(name: string, params?: GtagEventParams): void {
  if (!isBrowser) return;
  if (!initialized) {
    bufferedCalls.push({ type: 'event', args: [name, params || {}] });
    initGtag();
    return;
  }
  executeCall('event', name, params || {});
  logDebug('event', name, params || {});
}

export function setConsent(granted: boolean): void {
  if (!isBrowser) return;
  if (!initialized) initGtag();
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
  } catch (err) {
    logWarn('consent_storage', err);
  }
  updateDisableFlags(granted);
  const gtag = w.gtag;
  if (typeof gtag === 'function') {
    try {
      gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
      });
    } catch (err) {
      logError('consent_update_error', err);
    }
  }
  if (granted) {
    trackPageView();
  }
  logDebug('consent', granted);
}

export function toggleConsent(): boolean {
  const next = !isConsentGranted();
  setConsent(next);
  return next;
}

export function __testOnly_reset(): void {
  if (!isBrowser) return;
  initialized = false;
  currentMeasurementId = w.__gtag_fallback_id || null;
  dataLayerRef = null;
  bufferedCalls = [];
  conflictDetected = false;
  delete w.dataLayer;
  delete w.gtag;
  for (const id of getIdList()) {
    delete w[`ga-disable-${id}` as const];
  }
  if (typeof document !== 'undefined') {
    document.getElementById('gtag-script-src')?.remove();
  }
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* noop */
  }
}
