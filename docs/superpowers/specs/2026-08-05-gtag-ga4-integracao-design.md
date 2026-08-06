# Especificação: Integração e Validação Completa do gtag.js (GA4)

Data: 2026-08-05
Projeto: Repal Londrina
Propriedade GA4 alvo: `G-X95YSNPVGD`

## 1. Objetivo

Integrar o Google Analytics 4 via `gtag.js` no site Repal Londrina com:
- Carregamento garantido (fallback hardcoded + sobrescrita via admin)
- Validação automática e manual completa
- Modo de depuração oficial
- Testes automatizados
- Conformidade de privacidade (opt-out)

## 2. Requisitos Atendidos

| Ref | Requisito | Status |
|---|---|---|
| R1 | Integrar script gtag.js no `<head>` + fallback ID + sobrescrita via banco | ✅ Especificado |
| R2a | Validar carga do script (CORS/rede) | ✅ Especificado |
| R2b | Verificar dataLayer/gtag sem conflitos | ✅ Especificado |
| R2c | Logs de debug (dev / ?gtag_debug=true) | ✅ Especificado |
| R3 | Modo debug oficial GA4 (debug_mode=true) | ✅ Especificado |
| R4a | Script carrega async sem bloquear renderização | ✅ Especificado |
| R4b | Eventos padrão e personalizados enviados | ✅ Especificado |
| R4c | Sem erros JS de/do gtag no console | ✅ Especificado |
| R5 | Guia manual: Tag Assistant + Realtime GA4 | ✅ Especificado |
| R6 | Opt-out via `ga-disable-ID` + toggle em página | ✅ Especificado |
| R7 | Relatório final + orientações de manutenção | ✅ Especificado |

## 3. Arquitetura e Arquivos

### 3.1 Criados

- **`src/lib/analytics/gtag.ts`** — Módulo central com toda a API
- **`src/hooks/useAnalyticsConsent.ts`** — Hook para opt-in/opt-out
- **`src/__tests__/gtag.test.ts`** — Suite Vitest + jsdom
- **`docs/gtag-validacao.md`** — Guia manual + relatório final

### 3.2 Modificados

- **`index.html`** — Injeta gtag.js hardcoded no `<head>` com ID fallback `G-X95YSNPVGD`
- **`src/main.tsx`** — Refatora `loadIntegrations()`: usa módulo gtag.ts; reconfigura com ID do banco se existir; inicializa consentimento
- **`src/hooks/useSiteSettings.ts`** — Expor `gaId` (integrations.google_analytics_id)
- **`src/components/Footer.tsx`** — Toggle "Permitir Analytics" (acessível a todos os visitantes, sem necessidade de login)
- **`src/hooks/useErrorHandler.ts`** — Usa wrapper seguro do módulo ao invés de `(window as any).gtag`

## 4. Módulo `gtag.ts` — API

### 4.1 Constantes

```ts
const FALLBACK_MEASUREMENT_ID = 'G-X95YSNPVGD';
const CONSENT_STORAGE_KEY = 'analytics_consent';
```

### 4.2 Funções Públicas

```
initGtag(measurementId?: string, options?: { debug?: boolean })
  └─ Valida se já carregado, configura consentimento salvo, re-configura se vier ID novo

trackPageView(path?: string, title?: string)
  └─ ['event', 'page_view', { page_path, page_title, send_to: ID }]

trackEvent(name: string, params?: Record<string, any>)
  └─ Wrapper seguro: se consentimento negado → no-op;
     se script não carregou → bufferiza e reenvia após init

setConsent(granted: boolean)
  └─ Salva em localStorage; atualiza window['ga-disable-ID'];
     chama gtag('consent', 'update', ...); se passou a granted → dispara page_view atual

isLoaded(): boolean
isConsentGranted(): boolean
isDebugEnabled(): boolean
getCurrentMeasurementId(): string | null
```

### 4.3 Validações Internas

| Verificação | Implementação |
|---|---|
| Carga do script sem erros | Checa `performance.getEntriesByName(url)` após 5s; attach `onerror` no script tag |
| dataLayer é array + tem push | A cada track: `Array.isArray(dataLayer) && typeof dataLayer.push === 'function'`; se quebrado → warning + tenta restaurar referência do `window.dataLayer` original |
| gtag é função | Mesmo gatilho; se indefinido antes do load → usa buffer |
| Conflito pós-GTM/Pixel | Em `main.tsx`, após carregar GTM e Facebook Pixel: compara referência original do dataLayer com atual; se mudou → log warning |

### 4.4 Logs

Apenas se `import.meta.env.DEV || location.search.includes('gtag_debug=true')`:
```
[gtag:init] <id> <debug?>
[gtag:page_view] <path> <title>
[gtag:event] <name> <params>
[gtag:consent] <granted>
[gtag:load_failed] <motivo>
[gtag:conflict] dataLayer sobrescrito
```

### 4.5 Debug Mode Oficial

Se `isDebugEnabled()`: passa `{ debug_mode: true }` como terceiro parâmetro de `gtag('config', ID, { debug_mode: true })`. Faz eventos aparecerem no DebugView do GA4 em tempo real.

## 5. Consentimento (Opt-out)

- Chave: `localStorage['analytics_consent']` → `'granted'` ou `'denied'`
- Se `'denied'` **antes do init**: `window['ga-disable-G-X95YSNPVGD'] = true` (método oficial Google, nenhum byte é enviado)
- `setConsent(false)` em runtime: ativa a flag + todos trackEvent/PageView tornam-se no-op
- `setConsent(true)`: remove a flag + `gtag('consent', 'update', {... granted })` + `trackPageView()` atual

## 6. Integração no `index.html`

Segue padrão oficial do Google — `gtag()` e `config` são chamados imediatamente (o script é async e o dataLayer acumula comandos até o download terminar). O `?gtag_debug=true` é detectado inline:

```html
<head>
  ...
  <!-- Google tag (gtag.js) - GA4 fallback: G-X95YSNPVGD -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.__gtag_debug = /[?&]gtag_debug=true/.test(location.search);
    window.__gtag_fallback_id = 'G-X95YSNPVGD';
    gtag('js', new Date());
    gtag('config', 'G-X95YSNPVGD', window.__gtag_debug ? { debug_mode: true } : {});
  </script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-X95YSNPVGD"></script>
  <!-- Inline de opt-out: aplica antes de qualquer request de analytics -->
  <script>
    (function(){try{
      var c = localStorage.getItem('analytics_consent');
      if (c === 'denied') window['ga-disable-G-X95YSNPVGD'] = true;
    }catch(e){}})();
  </script>
</head>
```

Depois, em `main.tsx`, se vier ID novo do banco (`dbGaId` vindo de `site_settings.integrations.google_analytics_id`) e ele for diferente do fallback:
```ts
if (dbGaId && dbGaId !== FALLBACK_MEASUREMENT_ID) {
  (window as any)['ga-disable-' + FALLBACK_MEASUREMENT_ID] = true; // desliga o fallback
  initGtag(dbGaId); // reconfigura com o ID do banco (debug_mode herdado)
  trackPageView(); // dispara page_view também para o ID novo
}
```

## 7. Testes Automatizados (Vitest + jsdom)

Suite em `src/__tests__/gtag.test.ts` (10 casos):
1. `initGtag cria dataLayer e gtag function corretamente`
2. `initGtag NÃO sobrescreve dataLayer/gtag já existentes`
3. `script tag é criado com async=true e src correto`
4. `trackEvent pusha evento com params para dataLayer`
5. `trackPageView envia page_view com page_path + page_title`
6. `setConsent(false) ativa ga-disable e bloqueia eventos`
7. `setConsent(true) re-ativa e dispara page_view atual`
8. `modo debug injeta debug_mode no config`
9. `conflito (dataLayer sobrescrito) → warning sem crash`
10. `trackEvent antes de init → bufferiza e reenvia pós-init`

## 8. Guia de Verificação Manual (em `docs/gtag-validacao.md`)

### A. Google Tag Assistant (Chrome)
1. Instalar "Tag Assistant Companion"
2. Site → clicar ícone → Enable → Done
3. Verificar **Google tag (G-X95YSNPVGD)** com status verde
4. Aba "Tags disparadas" → Page View + config
5. `?gtag_debug=true` → DebugView do GA4 ilumina

### B. GA4 Realtime (G-X95YSNPVGD)
1. GA4 → Relatórios → Tempo Real
2. Acessar site em aba anônima → 1 usuário ativo em ≤ 30s
3. Visualizações de página → título aparece
4. Abrir produto → `view_item` em "Eventos por nome"

### C. Console
- `?gtag_debug=true` → mensagens `[gtag:*]`
- `window.dataLayer` → array populado
- Executar `window.gtag('event', 'teste_manual')` → aparece no DebugView

## 9. Relatório Final

Conteúdo de `docs/gtag-validacao.md` na seção "Relatório Final":
- Checklist R1–R7 marcado com data e status
- Output do terminal após `npm run test gtag` (todos passando)
- Amostra de eventos capturados: page_view, view_item, exception, generate_lead
- Como criar eventos personalizados: `import { trackEvent } from '@/lib/analytics/gtag'; trackEvent('nome', {...})`
- Manutenção: trocar ID no painel admin (Settings → Analytics → Google Analytics ID) salva no Supabase e sobrescreve o fallback; atualizar guias quando houver mudança de propriedade GA4.
