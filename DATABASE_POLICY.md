# Política de Banco de Dados do Projeto

## ⚠️ AVISO IMPORTANTE ⚠️

Este projeto possui uma **regra estrita** de vinculação ao banco de dados Supabase oficial.

**URL do Banco de Dados Permitida:**
`https://lbrkgkiosxprpcgmonxy.supabase.co`

### Por que isso existe?
Para garantir a integridade dos dados e evitar que desenvolvedores ou ambientes de teste se conectem acidentalmente a bancos de dados incorretos, fragmentando o desenvolvimento.

### Como funciona?
O arquivo `backend/config/env.js` contém uma verificação em tempo de execução. Se a variável de ambiente `VITE_SUPABASE_URL` não corresponder ao ID do projeto autorizado (`lbrkgkiosxprpcgmonxy`), a aplicação backend **se recusará a iniciar**, emitindo um erro fatal.

### O que fazer se o servidor não iniciar?
1. Verifique seu arquivo `.env`.
2. Certifique-se de que `VITE_SUPABASE_URL` está definida corretamente.
3. Não tente alterar o banco de dados sem autorização explícita e refatoração da regra de segurança.
