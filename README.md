# Repal Londrina - Site Institucional e E-commerce

Site institucional e catálogo de produtos da Repal Londrina, especializada em equipamentos para gastronomia, refrigeração comercial e instalações comerciais.

## 🚨 Política de Banco de Dados (CRÍTICO)

Este projeto possui uma **trava de segurança** que impede a execução com bancos de dados não autorizados.

- **Banco de Dados Oficial:** Supabase (`lbrkgkiosxprpcgmonxy`)
- **Política Detalhada:** Consulte o arquivo [DATABASE_POLICY.md](./DATABASE_POLICY.md) para mais detalhes.
- **Atenção:** A aplicação não iniciará se a variável `VITE_SUPABASE_URL` no arquivo `.env` for diferente da oficial.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS + Lucide React (Ícones)
- **Gerenciamento de Estado:** Zustand + React Query (TanStack Query)
- **Roteamento:** React Router DOM
- **Editor de Texto:** React Quill (para descrições de produtos)
- **Notificações:** Sonner

### Backend & Serviços
- **Backend API:** Node.js + Express (Servidor Customizado)
- **Database:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **IA:** Google Gemini API (Geração automática de descrições e SEO)
- **Segurança:** Helmet, CORS, Rate Limiting

## 📋 Funcionalidades

### Área Pública
- 🏠 **Home:** Banners rotativos, produtos em destaque, marcas parceiras.
- 🛍️ **Catálogo:** Listagem de produtos com filtros avançados (categoria, preço, marca).
- 🔍 **Busca:** Pesquisa inteligente de produtos.
- 📱 **Responsividade:** Layout adaptável para Mobile, Tablet e Desktop.
- 📞 **Leads:** Integração com WhatsApp e formulários de contato.
- 📍 **Lojas:** Localizador de lojas físicas.

### Painel Administrativo (Área Restrita)
- 📊 **Dashboard:** Métricas de acesso e leads.
- 📦 **Produtos:** CRUD completo, galeria de imagens, gestão de preços e estoque.
- ✨ **IA Generativa:** Criação automática de descrições e metadados SEO para produtos.
- 🏷️ **Categorias & Marcas:** Gestão da árvore de categorias e parceiros.
- 📢 **Marketing:** Gestão de Banners e Promoções.
- 👥 **Usuários:** Controle de acesso e permissões.

## 🛠️ Configuração do Ambiente

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Ronickbr/Repal_londrina.git
   cd Repal_Londrina
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz baseado no `.env.example`:

   ```env
   # Frontend
   VITE_SUPABASE_URL=https://lbrkgkiosxprpcgmonxy.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima

   # Backend (Necessário para operações administrativas)
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
   
   # IA (Opcional)
   GEMINI_API_KEY=sua_chave_gemini

   # Segurança
   ENCRYPTION_KEY=chave_para_criptografia
   JWT_SECRET=segredo_jwt
   ```

4. **Inicie o Projeto**

   **Modo Desenvolvimento (Frontend + Backend):**
   ```bash
   npm run dev      # Inicia o Vite (Frontend)
   npm run server   # Inicia o Servidor Node (Backend) - Em outro terminal
   ```

   **Modo Produção:**
   ```bash
   npm run build
   npm run start    # Ou comando equivalente para servir o build
   ```

## 📂 Estrutura do Projeto

```
Repal_Londrina/
├── backend/            # Servidor Node.js Express
│   ├── config/         # Configurações (Env, Supabase)
│   ├── controllers/    # Lógica das rotas
│   ├── routes/         # Definição de endpoints da API
│   └── services/       # Regras de negócio
├── src/                # Frontend React
│   ├── components/     # Componentes UI reutilizáveis
│   ├── contexts/       # Contextos globais (Auth, etc)
│   ├── hooks/          # Custom Hooks
│   ├── lib/            # Configurações de libs (Supabase, Query)
│   ├── pages/          # Páginas da aplicação
│   │   ├── admin/      # Páginas do Painel Admin
│   │   └── ...         # Páginas Públicas
│   └── types/          # Definições de Tipos TypeScript
├── supabase/           # Arquivos do Banco de Dados
│   ├── migrations/     # Scripts SQL de migração
│   └── backup/         # Backups de segurança
└── public/             # Assets estáticos
```

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento Vite.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Executa a verificação de código (ESLint).
- `npm run server`: Inicia o backend Node.js.
- `npm run generate:sitemap`: Gera o sitemap.xml atualizado.

## 🔒 Segurança

Este projeto segue práticas rigorosas de segurança:
- **RLS (Row Level Security):** Dados protegidos diretamente no banco de dados.
- **Validação de Banco:** Trava lógica no código para impedir conexão com bancos desconhecidos.
- **Autenticação:** Gerenciada via Supabase Auth.

---
© 2025 Repal Londrina. Todos os direitos reservados.
