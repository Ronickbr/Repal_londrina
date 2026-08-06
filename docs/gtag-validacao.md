# Validação e Manutenção do Google Analytics 4 (gtag.js)

Propriedade: **G-X95YSNPVGD** (Repal Londrina)
Data da implementação: 2026-08-05

---

## 1. Checklist Técnico de Requisitos

| Ref | Requisito | Status | Onde está implementado |
|---|---|---|---|
| R1 | Script gtag.js no `<head>` (fallback G-X95YSNPVGD) | ✅ Implementado | [index.html](file:///d:/Sites/Repal_Londrina/index.html#L11-L26) |
| R1 | Sobrescrita via `site_settings.google_analytics_id` no Supabase | ✅ Implementado | [main.tsx](file:///d:/Sites/Repal_Londrina/src/main.tsx#L89-L96) |
| R2a | Validação de carga do script (performance API + onerror) | ✅ Implementado | [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L234-L252) |
| R2b | Verificação dataLayer / gtag / conflitos com GTM/Pixel | ✅ Implementado | [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L89-L123), [main.tsx](file:///d:/Sites/Repal_Londrina/src/main.tsx#L84-L87) |
| R2c | Logs de debug (`[gtag:*]`) apenas em DEV ou `?gtag_debug=true` | ✅ Implementado | [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L62-L86) |
| R3 | Modo debug oficial GA4 (`debug_mode: true`) | ✅ Implementado | [index.html](file:///d:/Sites/Repal_Londrina/index.html#L18), [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L286-L296) |
| R4a | Script carrega async sem bloquear renderização | ✅ Implementado | [index.html](file:///d:/Sites/Repal_Londrina/index.html#L20), [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L277-L284) |
| R4b | Eventos padrão (page_view) e personalizados enviados | ✅ Implementado | [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L299-L335), [App.tsx](file:///d:/Sites/Repal_Londrina/src/App.tsx#L66-L68) |
| R4c | Sem erros JS de/do gtag após integração | ✅ Testes | Suite Vitest abaixo |
| R5 | Guia verificação manual (Tag Assistant + Realtime GA4) | ✅ Abaixo | Seção 2 |
| R6 | Opt-out via `ga-disable-ID` + toggle rodapé | ✅ Implementado | [Footer.tsx](file:///d:/Sites/Repal_Londrina/src/components/Footer.tsx#L104-L124), [gtag.ts](file:///d:/Sites/Repal_Londrina/src/lib/analytics/gtag.ts#L152-L166) |
| R7 | Relatório final + orientações de manutenção | ✅ Este arquivo | Seção 4 |

---

## 2. Guia de Verificação Manual para Equipe

### 2.1 Google Tag Assistant (Validação de tag no navegador)

1. **Chrome** → Instalar extensão oficial: [Tag Assistant Companion for Chrome](https://chromewebstore.google.com/detail/tag-assistant-companion/jmekfmbnaedfefkjofalmhbkehjbpgog)
2. Abrir o site `https://www.repallondrina.com.br`
3. Clicar no ícone **Tag Assistant** (ao lado da barra de endereço) → **Enable** → **Done**
4. A extensão recarregará a página. Verificar no painel:
   - ✅ Aparece **"Google tag"** ou **"GA4"** com ID **G-X95YSNPVGD**
   - ✅ Status **verde** (sem erros de CORS, bloqueio ou script faltante)
   - ✅ Aba "Tags disparadas" → `Page View` + `config` aparecem na lista
5. Teste de modo debug: acessar `https://www.repallondrina.com.br/?gtag_debug=true`
   - ✅ No Tag Assistant, os eventos aparecem marcados com "Debug mode"
   - ✅ Console do navegador exibe linhas `[gtag:init]`, `[gtag:page_view]`, `[gtag:event]`

### 2.2 Relatórios em Tempo Real do Google Analytics 4 (G-X95YSNPVGD)

1. Acessar [https://analytics.google.com](https://analytics.google.com) → logar com conta da Repal
2. Selecionar a propriedade **G-X95YSNPVGD** (Repal Londrina)
3. Menu lateral → **Relatórios** → **Tempo Real**
4. **Teste de usuário ativo:**
   - Abrir o site em **janela anônima** (ou navegador secundário, VPN se possível)
   - No card "Usuários ativos no momento" → deve subir para **1** dentro de **30 segundos**
   - Em "Países/Regiões" → deve aparecer Brasil (BR)
5. **Teste de visualização de página:**
   - Na janela anônima, navegar para a página `/sobre`
   - Em "Visualizações de página por título" → aparecerá o título "Sobre" correspondente
6. **Teste de evento em produto:**
   - Abrir página detalhe de qualquer produto (ex: `/produto/slug-do-produto`)
   - Em "Eventos por nome do evento" → em até 1 minuto, aparece o evento `page_view` com o path do produto
7. **DebugView (avançado):**
   - Menu lateral → **Administrador** → **Propriedade** → **DebugView**
   - Acessar site com `?gtag_debug=true`
   - O DebugView recebe eventos em tempo real (delay ~5s): `page_view`, `session_start`, `first_visit`, eventos customizados

### 2.3 Console do Navegador (Debug rápido)

1. F12 → aba **Console**
2. Digitar `window.dataLayer` → deve retornar um **Array** com vários objetos (eventos)
3. Digitar:
   ```js
   window.gtag('event', 'teste_manual_equipe', { teste: true, valor: 42 })
   ```
   → Sem erros no console. O evento aparece no DebugView do GA4 em segundos.
4. Digitar `isConsentGranted()` via import (opcional), ou checar:
   ```js
   localStorage.getItem('analytics_consent')
   ```
5. Teste de opt-out: clicar no toggle no rodapé → Analytics: **Desativado**
   ```js
   window['ga-disable-G-X95YSNPVGD'] // === true
   localStorage.getItem('analytics_consent') // === 'denied'
   ```
   → Novos eventos NÃO são enviados para o GA4.

---

## 3. Testes Automatizados (Vitest + jsdom)

### Como rodar

```bash
npm.cmd exec -- vitest run src/__tests__/gtag.test.ts --reporter=verbose
```

### Resultado efetivo (executado em 2026-08-05, ambiente Windows / Node Vitest 2.1.9 / jsdom)

```
 RUN  v2.1.9 D:/Sites/Repal_Londrina

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  20:56:54
   Duration  10.57s

 ✓ 1. initGtag cria dataLayer e gtag function corretamente
 ✓ 2. initGtag NÃO sobrescreve dataLayer/gtag já existentes
 ✓ 3. script tag é criado com async=true e src correto
 ✓ 4. trackEvent pusha evento com params para dataLayer
 ✓ 5. trackPageView envia page_view com page_path + page_title
 ✓ 6. setConsent(false) ativa ga-disable e bloqueia eventos
 ✓ 7. setConsent(true) re-ativa e dispara page_view atual
 ✓ 8. modo debug injeta debug_mode=true no config
 ✓ 9. conflito (dataLayer sobrescrito) = warning sem crash
 ✓ 10. trackEvent antes de init -> bufferiza e reenvia pós-init
 ✓ 11. toggleConsent alterna entre granted/denied corretamente
```

### 3.1 Amostra de eventos capturados (dataLayer após inicialização + navegação)

```js
// dataLayer após: inicialização gtag + navegação /produto/liquidificador-supreme + erro tratado
[
  ['set', 'js', Date],
  ['config', 'G-X95YSNPVGD', { debug_mode: true }],
  ['event', 'page_view', { page_path: '/', page_title: 'Repal Londrina', page_location: 'https://repallondrina.com.br/', send_to: 'G-X95YSNPVGD' }],
  ['event', 'page_view', { page_path: '/produto/liquidificador-supreme', page_title: 'Liquidificador Supreme 1200W', send_to: 'G-X95YSNPVGD' }],
  ['event', 'exception', { description: 'Erro simulado em teste', fatal: false, error_code: 'SIM_001' }],
]
```

---

## 4. Orientações de Manutenção Futura

### 4.1 Como enviar novos eventos no código

```ts
import { trackEvent, trackPageView } from '@/lib/analytics/gtag';

// Em ProductDetail.tsx (exemplo quando abre um produto)
trackEvent('view_item', {
  currency: 'BRL',
  value: product.price,
  items: [{
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    item_category: product.categoryName,
  }],
});

// Em ContactForm.tsx (quando usuário envia mensagem/lead)
trackEvent('generate_lead', {
  form_name: 'contato',
  customer_email: email,
  customer_phone: phone,
});
```

### 4.2 Como trocar o Measurement ID (ID GA4) sem deploy novo

O ID pode ser sobrescrito no painel admin do site:

1. Entrar em `/admin/settings` → aba **Analytics**
2. Campo **Google Analytics ID** → inserir novo ID no formato `G-XXXXXXXXXX`
3. Salvar.

**Efeito:** O fallback hardcoded `G-X95YSNPVGD` é desligado (`ga-disable-G-X95YSNPVGD = true`) e o novo ID recebe os eventos daqui em diante. **Observação:** o primeiro page_view sempre vai para o fallback, os próximos vão para o novo ID. Para evitar completamente disparos ao ID antigo, remova-o do `index.html` e faça um novo deploy.

### 4.3 Debug de integração nova (quando adicionar eventos)

1. Sempre usar `?gtag_debug=true` no final da URL
2. Verificar no **DebugView do GA4** se o evento aparece com os parâmetros corretos
3. Se não aparecer:
   - Abrir Console → aba **Network** → filtrar por `google-analytics.com` ou `collect?v=2`
   - Deve aparecer requisição POST/GET para `www.google-analytics.com/g/collect` com status **204**
   - Se não houver requisição: verificar se `ga-disable-ID = true` (opt-out)
   - Se houver erro CORS/403: confirmar que o Measurement ID está correto e pertence à conta logada

### 4.4 Políticas de privacidade atualização

Sempre que novas categorias de cookie forem adicionadas, atualizar:

- O toggle no Footer.tsx (hoje é só analytics)
- O `setConsent()` em `gtag.ts` (mapear flags `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`)
- A política de privacidade do site (página Sobre ou link externo)

### 4.5 Validação antes de deploy para produção

1. **Staging/Homologação:**
   - Rodar `npm.cmd exec -- vitest run src/__tests__/gtag.test.ts` → 11/11 passando
   - Rodar `npm run check` → sem erros TypeScript
   - Abrir site com `?gtag_debug=true` → confirmar eventos chegando no DebugView do GA4 de **homolog** (usar ID separado se existir)
2. **Produção:**
   - Após deploy, primeira checagem: Tag Assistant confirma tag verde G-X95YSNPVGD
   - Segunda checagem: GA4 Realtime mostra 1 usuário ativo quando você acessa
   - Terceira checagem: disparar `teste_manual_equipe` no Console e confirmar no Realtime/DebugView
