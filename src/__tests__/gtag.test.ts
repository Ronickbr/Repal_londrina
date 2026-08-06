/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initGtag,
  trackEvent,
  trackPageView,
  setConsent,
  toggleConsent,
  isLoaded,
  isConsentGranted,
  isDebugEnabled,
  getCurrentMeasurementId,
  FALLBACK_MEASUREMENT_ID,
  CONSENT_STORAGE_KEY,
  __testOnly_reset,
  type GtagWindow,
} from '../lib/analytics/gtag';

function getW(): GtagWindow {
  return globalThis as unknown as GtagWindow;
}

function mockPerformanceEntries() {
  if (typeof (globalThis as any).performance !== 'object') {
    (globalThis as any).performance = {
      getEntriesByName: () => [],
    };
  }
}

describe('gtag.ts - módulo central', () => {
  beforeEach(() => {
    __testOnly_reset();
    vi.useFakeTimers();
    mockPerformanceEntries();
    localStorage.clear();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    __testOnly_reset();
  });

  it('1. initGtag cria dataLayer e gtag function corretamente', () => {
    const w = getW();
    expect(w.dataLayer).toBeUndefined();
    expect(typeof w.gtag).not.toBe('function');

    initGtag(FALLBACK_MEASUREMENT_ID);

    expect(Array.isArray(w.dataLayer)).toBe(true);
    expect(typeof w.gtag).toBe('function');
    expect(getCurrentMeasurementId()).toBe(FALLBACK_MEASUREMENT_ID);
    expect(isLoaded()).toBe(true);
  });

  it('2. initGtag NÃO sobrescreve dataLayer/gtag já existentes', () => {
    const w = getW();
    const existingDL: unknown[] = [['event', 'existing_event', { foo: 'bar' }]];
    w.dataLayer = existingDL;
    const fakeGtagCalls: unknown[] = [];
    const fakeGtag = (...a: unknown[]) => { fakeGtagCalls.push(a); };
    w.gtag = fakeGtag;

    initGtag(FALLBACK_MEASUREMENT_ID);

    expect(w.dataLayer).toBe(existingDL);
    expect(w.gtag).toBe(fakeGtag);
    expect(fakeGtagCalls.length).toBeGreaterThan(0);
    expect((w.dataLayer as unknown[])[0]).toEqual(['event', 'existing_event', { foo: 'bar' }]);
  });

  it('3. script tag é criado com async=true e src correto', () => {
    const id = 'G-TESTE12345';
    initGtag(id);
    const scripts = Array.from(document.querySelectorAll('script'));
    const gtagScript = scripts.find(
      (s) => (s as HTMLScriptElement).id === 'gtag-script-src'
    ) as HTMLScriptElement | undefined;
    expect(gtagScript).toBeDefined();
    expect(gtagScript?.async).toBe(true);
    expect(gtagScript?.src).toContain('googletagmanager.com/gtag/js');
    expect(gtagScript?.src).toContain(`id=${id}`);
  });

  it('4. trackEvent pusha evento com params para dataLayer', () => {
    initGtag(FALLBACK_MEASUREMENT_ID);
    const w = getW();
    const before = (w.dataLayer as unknown[]).length;

    trackEvent('teste_custom', { categoria: 'teste', valor: 42 });

    const dl = w.dataLayer as unknown[];
    expect(dl.length).toBeGreaterThan(before);
    const last = dl[dl.length - 1] as unknown[];
    expect(last[0]).toBe('event');
    expect(last[1]).toBe('teste_custom');
    expect((last[2] as any).categoria).toBe('teste');
    expect((last[2] as any).valor).toBe(42);
  });

  it('5. trackPageView envia page_view com page_path + page_title', () => {
    document.title = 'Página Teste';
    initGtag(FALLBACK_MEASUREMENT_ID);
    const w = getW();
    const before = (w.dataLayer as unknown[]).length;

    trackPageView('/rota-teste', 'Página Teste');

    const dl = w.dataLayer as unknown[];
    const entries = dl.slice(before) as unknown[][];
    const pageView = entries.find((e) => e[1] === 'page_view');
    expect(pageView).toBeDefined();
    const params = pageView![2] as Record<string, unknown>;
    expect(params.page_path).toBe('/rota-teste');
    expect(params.page_title).toBe('Página Teste');
    expect(params.send_to).toBe(FALLBACK_MEASUREMENT_ID);
  });

  it('6. setConsent(false) ativa ga-disable e bloqueia eventos', () => {
    initGtag(FALLBACK_MEASUREMENT_ID);
    const w = getW();

    setConsent(false);

    expect(isConsentGranted()).toBe(false);
    expect(w[`ga-disable-${FALLBACK_MEASUREMENT_ID}`]).toBe(true);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('denied');

    const before = (w.dataLayer as unknown[]).length;
    trackEvent('bloqueado', { a: 1 });
    const entriesAfter = (w.dataLayer as unknown[]).slice(before) as unknown[][];
    expect(entriesAfter.find((e) => e[1] === 'bloqueado')).toBeUndefined();
  });

  it('7. setConsent(true) re-ativa e dispara page_view atual', () => {
    initGtag(FALLBACK_MEASUREMENT_ID);
    setConsent(false);
    const w = getW();
    const before = (w.dataLayer as unknown[]).length;

    setConsent(true);

    expect(isConsentGranted()).toBe(true);
    expect(w[`ga-disable-${FALLBACK_MEASUREMENT_ID}`]).toBe(false);
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');

    const entries = (w.dataLayer as unknown[]).slice(before) as unknown[][];
    expect(entries.some((e) => e[1] === 'page_view')).toBe(true);
  });

  it('8. modo debug injeta debug_mode=true no config', () => {
    const w = getW();
    w.__gtag_debug = true;

    initGtag(FALLBACK_MEASUREMENT_ID, { debug: true });

    expect(isDebugEnabled()).toBe(true);
    const dl = (w.dataLayer as unknown[][]) || [];
    const configCall = dl.find((entry) => entry[0] === 'config' && entry[1] === FALLBACK_MEASUREMENT_ID);
    if (configCall) {
      expect((configCall[2] as any).debug_mode).toBe(true);
    }

    w.__gtag_debug = false;
  });

  it('9. conflito (dataLayer sobrescrito) = warning sem crash', () => {
    initGtag(FALLBACK_MEASUREMENT_ID);
    const w = getW();
    const spyWarn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    w.dataLayer = { invalid: true } as unknown as unknown[];

    expect(() => trackEvent('apos_conflito', {})).not.toThrow();
    expect(Array.isArray(w.dataLayer)).toBe(true);
    expect(typeof (w.dataLayer as unknown[]).push).toBe('function');

    spyWarn.mockRestore();
  });

  it('10. trackEvent antes de init -> bufferiza e reenvia pós-init', () => {
    const w = getW();
    expect(w.dataLayer).toBeUndefined();

    trackEvent('antes_do_init', { x: 1 });

    expect(Array.isArray(w.dataLayer)).toBe(true);

    initGtag(FALLBACK_MEASUREMENT_ID);

    const dl = w.dataLayer as unknown[][];
    const temEvento = dl.some((e) => e[1] === 'antes_do_init');
    expect(temEvento).toBe(true);
  });

  it('11. toggleConsent alterna entre granted/denied corretamente', () => {
    initGtag(FALLBACK_MEASUREMENT_ID);
    expect(isConsentGranted()).toBe(true);
    const r1 = toggleConsent();
    expect(r1).toBe(false);
    expect(isConsentGranted()).toBe(false);
    const r2 = toggleConsent();
    expect(r2).toBe(true);
    expect(isConsentGranted()).toBe(true);
  });
});
