# Repal Londrina — Site Institucional + Catálogo e E-commerce

<p align="center">
  <a href="#-sobre">Sobre</a> •
  <a href="#-stack-tecnológica">Stack</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-analytics-e-métricas">Analytics</a> •
  <a href="#%EF%B8%8F-configuração-do-ambiente">Ambiente</a> •
  <a href="#-scripts-disponíveis">Scripts</a> •
  <a href="#-estrutura-do-projeto">Estrutura</a> •
  <a href="#-segurança">Segurança</a> •
  <a href="#-deploy-e-operações">Deploy</a> •
  <a href="#-licença">Licença</a>
</p>

---

<div align="center">

**Versão**  [`package.json`](./package.json)  **1.6.0**
<br />
**Release** [`v1.6.0`](https://github.com/Ronickbr/Repal_londrina/releases/tag/v1.6.0) · `feat(analytics)` — GA4 completo + toggle opt-out
<br />
**Repositório** [Ronickbr/Repal_londrina](https://github.com/Ronickbr/Repal_londrina) · `main`

</div>

---

## 🏷️ Badges

<div align="center">

![Versão](https://img.shields.io/badge/vers%C3%A3o-1.6.0-red?style=for-the-badge)
![Release](https://img.shields.io/github/v/release/Ronickbr/Repal_londrina?style=for-the-badge&logo=semver&color=%23CB3837)
![License](https://img.shields.io/badge/licen%C3%A7a-MIT-3DA639?style=for-the-badge)

![Node](https://img.shields.io/badge/Node-18%20%7C%2020%20%7C%2022-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)

![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-3C3C3D?style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)

![GA4](https://img.shields.io/badge/Google_Analytics-G--X95YSNPVGD-E37400?style=for-the-badge&logo=googleanalytics&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-IA-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Vercel Analytics](https://img.shields.io/badge/Vercel-Analytics%20%26%20Speed-000000?style=for-the-badge&logo=vercel)

![Vitest](https://img.shields.io/badge/Vitest-jsdom-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier-friendly](https://img.shields.io/badge/Prettier-friendly-F7B93E?style=for-the-badge)

</div>

---

## 📖 Sobre

Site institucional e catálogo de produtos da **Repal Londrina** — especializada em equipamentos para gastronomia, refrigeração comercial, panificação e instalações comerciais. A stack é **React 18 + TypeScript + Vite** no front e **Node.js + Express + Supabase** no backend, com:

- IA generativa (Google Gemini) para criação automatizada de descrições, SEO e metadados de produtos
- Múltiplos instrumentos de medição: **Google Analytics 4 (gtag.js)** oficial + **Google Tag Manager** + **Vercel Analytics + Speed Insights**
- Painel administrativo completo com dashboard, gestão de catálogo, banners, promoções, usuários/permissões e IA
- Formulários de contato e integração WhatsApp para **captação de leads**

> 👉 Documentação da integração GA4: [docs/gtag-validacao.md](./docs/gtag-validacao.md) · [Spec de design](./docs/superpowers/specs/2026-08-05-gtag-ga4-integracao-design.md)

---

## 🧱 Stack tecnológica

| Camada | Tecnologias |
|---|---|
| **Frontend** | React 18 · TypeScript 5.8 · Vite 6 · Tailwind CSS 3 · Lucide React · Sonner · React Quill · React Helmet Async |
| **Estado & Dados** | Zustand 5 · TanStack (React) Query 5 · Zod 4 (validação) |
| **Roteamento** | React Router DOM 7 |
| **Backend** | Node.js · Express 5 · Cookie Parser · CORS · Helmet 8 · JSON Web Token · Speakeasy (2FA) · Multer 2 |
| **Banco & Serviços** | Supabase (PostgreSQL · Auth · Storage · Realtime · RLS) |
| **IA** | Google Gemini API (geração de conteúdo e SEO) |
| **Observabilidade** | Google Analytics 4 · Google Tag Manager · Vercel Analytics · Vercel Speed Insights |
| **Qualidade & Teste** | ESLint 9 (TS + React hooks) · Vitest 2 + jsdom + @testing-library · Supertest (API) |
| **Build & Deploy** | Terser · vite-plugin-compression · Prerender (SPA → páginas estáticas) · Sitemap dinâmico · Deploy Vercel-ready |

---

## ✨ Funcionalidades

### 🌐 Área Pública (Páginas / Catálogo)

| Módulo | Descrição |
|---|---|
| 🏠 Home | Banners rotativos, produtos em destaque, marcas parceiras, CTA para leads |
| 🛍️ Catálogo | Listagem com filtros avançados — categoria / subcategoria / faixa de preço / marca |
| 📄 Produto | Página de detalhe (SEO otimizada), galeria, variações, formulário WhatsApp para orçamento |
| 🔍 Busca | Pesquisa inteligente (nome / descrição / categoria) |
| 📱 Responsivo | Mobile · Tablet · Desktop — Tailwind + breakpoints customizados |
| 📞 Leads | Formulário de contato + integração direta com WhatsApp das 2 lojas (Centro / Gleba Palhano) |
| 📍 Lojas | Mapa / localizador de lojas físicas da Repal Londrina |
| ⚖️ LGPD | **Toggle de opt-out de Analytics no rodapé** — persistido em `localStorage` e respeitado via `window['ga-disable-G-X95YSNPVGD']` |

### 🔐 Painel Administrativo (`/admin/*`)

- 📊 **Dashboard** — métricas de tráfego, leads, produtos em destaque
- 📦 **Produtos** — CRUD completo, galeria de imagens, gestão de preços, promoções, estoque
- ✨ **IA Generativa** — gera descrições, títulos SEO e metadados automaticamente via Google Gemini
- 🏷️ **Categorias & Marcas** — árvore de categorias/subcategorias + parceiros
- 📢 **Marketing** — banners, promoções, cupons, campanhas sazonais
- 👥 **Usuários** — controle de acesso e permissões (RBAC) + 2FA (Speakeasy)
- ⚙️ **Configurações do Site** — integrações (GTM, Google Analytics, Facebook Pixel, redes sociais, WhatsApp, meios de pagamento em destaque)

---

## 📈 Analytics e métricas (v1.6.0)

O painel `src/lib/analytics/gtag.ts` oferece uma API centralizada e segura:

```ts
import {
  initGtag,
  trackEvent,
  trackPageView,
  setConsent,
  toggleConsent,
  isConsentGranted,
  FALLBACK_MEASUREMENT_ID,   // 'G-X95YSNPVGD'
} from './lib/analytics/gtag';
```

| Camada | Como está implementado | Onde |
|---|---|---|
| **Carga do gtag.js** | Fallback hardcoded no `<head>` + sobrescrita via `site_settings.integrations.google_analytics_id` do Supabase | `index.html`, `src/main.tsx` |
| **Opt-out oficial Google** | `window['ga-disable-G-X95YSNPVGD'] = true` antes de qualquer envio · persistido em `localStorage['analytics_consent']` | `index.html`, `gtag.ts`, `Footer.tsx` |
| **Page Views automáticos** | 1x no fallback HTML + 1x a cada mudança de rota React Router (`useLocation`) | `App.tsx`, `gtag.ts` |
| **Eventos customizados** | `view_item`, `generate_lead`, `exception` (erros) e quaisquer outros via `trackEvent(nome, params)` | `useErrorHandler.ts` + qualquer arquivo da app |
| **Modo debug oficial** | `?gtag_debug=true` ativa `debug_mode: true` no `gtag('config')` e logs `[gtag:*]` no console | `gtag.ts` |
| **Conflitos dataLayer** | Detecção e auto-recuperação quando GTM / FB Pixel sobrescrevem `window.dataLayer` | `gtag.ts` |
| **Testes Vitest + jsdom** | 11 cenários passando (100%): init, dataLayer existente, script async, trackEvent, page_view, opt-out grant/deny, debug, conflito, buffer pré-init, toggle | `src/__tests__/gtag.test.ts` |

> Comando dos testes:
> ```bash
> npm.cmd exec -- vitest run src/__tests__/gtag.test.ts --reporter=verbose
> ```

### Como trocar o Measurement ID sem fazer deploy novo

1. Acessar `/admin/settings` → aba **Analytics**
2. Inserir novo ID no campo **Google Analytics ID** (formato `G-XXXXXXXXXX`) e salvar.
3. O fallback `G-X95YSNPVGD` é desligado automaticamente e os próximos eventos vão para o novo ID.

---

## ⚠️ Política de Banco de Dados (CRÍTICO)

Este projeto possui uma **trava de segurança** que impede a execução com bancos de dados não autorizados.

- **Banco de Dados Oficial:** Supabase · `lbrkgkiosxprpcgmonxy`
- **Documento completo:** [`DATABASE_POLICY.md`](./DATABASE_POLICY.md)
- **Comportamento:** A aplicação **não inicia** se `VITE_SUPABASE_URL` no `.env` for diferente da URL oficial.

---

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- **Node.js ≥ 18** (recomendado 20 LTS ou 22)
- **NPM ≥ 10** (não testado com Yarn/Pnpm — use NPM)
- Credenciais do Supabase e (opcional) Google Gemini API

### 1. Instalação

```bash
git clone https://github.com/Ronickbr/Repal_londrina.git
cd Repal_Londrina
npm install
```

### 2. Variáveis de ambiente

Copie `[.env.example](./.env.example)` para `.env` e preencha:

```env
# =====================
#  Frontend (Supabase)
# =====================
VITE_SUPABASE_URL=https://lbrkgkiosxprpcgmonxy.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# =====================
#  Backend / Operações
# =====================
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
ENCRYPTION_KEY=chave_para_criptografia_(min_32_chars)
JWT_SECRET=segredo_jwt_assinatura

# =====================
#  IA (opcional)
# =====================
GEMINI_API_KEY=sua_chave_google_gemini

# =====================
#  Observabilidade (opcional)
# =====================
# → Google Analytics 4 (gtag.js):
#   - Default = G-X95YSNPVGD (fallback no index.html)
#   - Pode sobrescrever SEM deploy: campo no /admin/settings (Supabase)
```

### 3. Iniciando a aplicação

**Desenvolvimento (2 terminais):**

```bash
# Terminal 1 — Vite (frontend, hot reload)
npm run dev

# Terminal 2 — Backend Express (API / CRUD admin)
npm run server
```

**Preview do build final:**

```bash
npm run build        # tsc -b + vite build + generate:sitemap
npm run preview      # Servidor de pré-visualização (Vite)
```

---

## 📜 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o Vite (modo desenvolvimento, HMR). |
| `npm run build` | `tsc -b --noEmit` + `vite build` + gera `sitemap.xml`. |
| `npm run build:prerender` | `build` + executa `scripts/prerender.mjs` (gera HTML estático por rota). |
| `npm run preview` | Sobe servidor de preview (Vite) do build final. |
| `npm run check` | `tsc -b --noEmit` (type check estrito do TypeScript). |
| `npm run lint` | ESLint 9 sobre o repositório (react-hooks, react-refresh, typescript-eslint). |
| `npm run server` | Inicia backend Express em `server.js` (API admin + uploads + operações). |
| `npm run generate:sitemap` | Regenera `public/sitemap.xml` baseado nas rotas públicas. |
| `npx vitest` | Ambiente interativo Vitest (modo watch, jsdom, testes do módulo gtag + API). |
| `npx vitest run` | Executa todos os testes 1x (ideal para CI/pré-deploy). |

---

## 🗂️ Estrutura do Projeto

```
Repal_Londrina/
├── index.html                 # Fallback gtag.js GA4 + opt-out inline
├── package.json               # v1.6.0 · scripts · dependencies
├── server.js                  # Backend Express (API / admin)
├── vite.config.ts             # Vite 6 + plugin-react + compression
├── tsconfig.*.json            # TypeScript (strict)
├── tailwind.config.js
├── public/                    # Assets estáticos (imagens, robots.txt, sitemap.xml)
├── scripts/                   # prerender.mjs · generate-sitemap.mjs
├── backend/                   # Servidor Node.js · Express
│   ├── config/                # Env · Supabase · Auth
│   ├── controllers/           # Lógica das rotas
│   ├── routes/                # Definição de endpoints
│   └── services/              # Regras de negócio · Integrações
├── docs/                      # Documentação (especificações, guias)
│   ├── gtag-validacao.md      # Guia validação GA4 + manutenção
│   └── superpowers/specs/     # Specs de design (GA4 e futuras features)
├── supabase/                  # Migrations SQL · RLS policies
│   └── migrations/
└── src/                       # Frontend React
    ├── App.tsx                # Providers + Router + AnalyticsPageViewTracker
    ├── main.tsx               # Bootstrap · GTM · GA4 gtag.js · Facebook Pixel
    ├── components/            # UI (Header, Footer, ProductCard, ...)
    ├── contexts/              # Auth / Budget / WhatsApp / Popup
    ├── hooks/                 # useSiteSettings, useAnalyticsConsent, useErrorHandler...
    ├── lib/                   # Config libs
    │   ├── analytics/gtag.ts  # Módulo central GA4 (API trackEvent/pageView/consent)
    │   ├── supabase.ts
    │   └── react-query.ts
    ├── pages/                 # Públicas (Home, ProductDetail, About, Contact, ...)
    │   └── admin/             # Dashboard, Products, Categories, Users, Settings...
    ├── layouts/               # AdminLayout
    ├── styles/                # responsive.css e outros globais
    ├── types/                 # Definições TypeScript
    └── __tests__/             # Vitest + jsdom (gtag.test.ts = 11 testes passando)
```

---

## 🔒 Segurança

| Item | Implementação |
|---|---|
| **RLS — Row Level Security** | Policies ativadas no Supabase para todas as tabelas acessíveis pelo anon key. |
| **Trava de Banco de Dados** | Aplicação aborta se `VITE_SUPABASE_URL` ≠ oficial. Ver [`DATABASE_POLICY.md`](./DATABASE_POLICY.md). |
| **Helmet + CORS + Rate Limit** | Headers de segurança e throttling no backend (Express 5 + Helmet 8). |
| **Autenticação** | JWT assinado + Supabase Auth + 2FA via Speakeasy. |
| **Uploads / Arquivos** | Multer 2 com validação de tipo/tamanho · Storage Supabase. |
| **XSS / Sanitização** | DOMPurify em campos ricos (React Quill) · Validação de entrada com Zod. |
| **Privacidade / LGPD** | Opt-out oficial Google Analytics persistido; nenhum disparo ocorre se o usuário negar consentimento. |

---

## 🚀 Deploy e Operações

### Aplicação (Vercel / plataforma Node static)

- Build padrão: `npm run build` (saída → `dist/`)
- **Deploy Vercel (sugerido):** variáveis de ambiente no painel + integração git → deploys automáticos em cada push `main`.
- **Self-host Node:** build + `npx serve dist/` (ou `node server.js` + servir `dist` como static).

### Checklist antes do deploy para produção

1. `npm run check` → 0 erros TypeScript
2. `npx vitest run` → 11/11 testes do módulo GA4 passando
3. `npm run lint` → (opcional, recomendado) 0 warnings críticos
4. Validação manual (ver [`docs/gtag-validacao.md`](./docs/gtag-validacao.md)):
   - Tag Assistant → `G-X95YSNPVGD` verde
   - GA4 → Realtime mostra 1 usuário ativo
   - `?gtag_debug=true` + DebugView → eventos chegando sem erro
5. Conferir integrações: WhatsApp, GTM, Facebook Pixel, Vercel Analytics/Speed Insights carregando sem conflitos

---

## 🆘 Troubleshooting rápido

| Sintoma | Causa provável | Correção |
|---|---|---|
| App não abre · erro "Banco não autorizado" | `VITE_SUPABASE_URL` ≠ URL oficial | Ajustar `.env` (ver [`DATABASE_POLICY.md`](./DATABASE_POLICY.md)) |
| Nenhum evento chega no GA4 | Opt-out ativo, ou Measurement ID do admin sobrescreveu o fallback | Checar `localStorage['analytics_consent']` e campo Google Analytics ID no `/admin/settings` |
| Testes `gtag.test.ts` falham com `window is not defined` | Vitest default env = node (não jsdom) | Arquivo já tem `/** @vitest-environment jsdom */` no topo |
| Erros "LF/CRLF" no git | Normal — o `.gitattributes`/autocrlf do Windows gera warnings | Sem impacto funcional |
| dataLayer vazio ou eventos duplicados | GTM / Facebook Pixel sobrescreveram `window.dataLayer` | `src/lib/analytics/gtag.ts` já se recupera automaticamente e loga warning `[gtag:conflict]` |

---

## 📝 Changelog (últimos releases)

- **v1.6.0** — `feat(analytics)`: integração completa GA4 (gtag.js · Measurement ID `G-X95YSNPVGD`) com fallback no head + sobrescrita via Supabase, módulo central `gtag.ts`, toggle opt-out no rodapé, page_view automático por rota, captura de exceptions, 11 testes Vitest/jsdom, documentação (spec + guia).
- **v1.5.1** — `chore(release)` / `fix(about)`: atualização de imagem da loja e bump de versão.

Para o histórico completo: `git --no-pager log --oneline`

---

## 📄 Licença

[MIT License](./LICENSE) · © 2026 Repal Londrina · Ronickbr
