# Guia de Deploy no Render

Este guia explica como fazer o deploy do Sistema de Gerenciamento de Documentos no Render usando um único serviço.

## Pré-requisitos

1. **Conta no GitHub** - Seu código deve estar em um repositório público
2. **Conta no Render** - Crie uma conta gratuita em [render.com](https://render.com)
3. **Conta no Supabase** - Para banco de dados e storage
4. **Chave do Google Gemini** - Para funcionalidade de IA

## Configuração dos Serviços Externos

### 1. Supabase
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Vá para **Settings > API** e copie:
   - `Project URL` (SUPABASE_URL)
   - `anon public` key (SUPABASE_KEY)
3. Execute o SQL da migração em **SQL Editor**:
   - Copie o conteúdo de `supabase/migrations/create_initial_schema.sql`
   - Execute no SQL Editor do Supabase
4. Configure o Storage:
   - Vá para **Storage**
   - Crie um bucket chamado `documentos`
   - Configure as políticas de acesso público se necessário

### 2. Google Gemini AI
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova API Key
3. Copie a chave (GEMINI_API_KEY)

## Deploy no Render

### Passo 1: Conectar Repositório
1. Faça login no Render
2. Clique em **New +** > **Web Service**
3. Conecte seu repositório do GitHub
4. Selecione o repositório do projeto

### Passo 2: Configurar o Serviço
1. **Name**: `gerenciador-documentos` (ou nome de sua escolha)
2. **Environment**: `Node`
3. **Region**: Escolha a mais próxima (ex: Oregon)
4. **Branch**: `main` (ou sua branch principal)
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`

### Passo 3: Configurar Variáveis de Ambiente
Adicione as seguintes variáveis de ambiente:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=[Gere uma senha forte - o Render pode gerar automaticamente]
SUPABASE_URL=[Sua URL do Supabase]
SUPABASE_KEY=[Sua chave pública do Supabase]
GEMINI_API_KEY=[Sua chave do Google Gemini]
```

### Passo 4: Deploy
1. Clique em **Create Web Service**
2. O Render iniciará o processo de build e deploy
3. Aguarde a conclusão (pode levar alguns minutos)

## Verificação do Deploy

### 1. Teste da API
Acesse: `https://seu-app.onrender.com/api/health`

Deve retornar:
```json
{
  "status": "OK",
  "message": "API está funcionando",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 2. Teste do Frontend
Acesse: `https://seu-app.onrender.com`

Deve carregar a página de login do sistema.

## Configurações Importantes

### Domínio Personalizado (Opcional)
1. No painel do Render, vá para **Settings**
2. Em **Custom Domains**, adicione seu domínio
3. Configure os DNS conforme instruções do Render

### Monitoramento
- O Render fornece logs em tempo real
- Configure alertas para monitorar a saúde da aplicação
- Use o endpoint `/api/health` para health checks

### Backup do Banco
- Configure backups automáticos no Supabase
- Exporte regularmente os dados importantes

## Solução de Problemas

### Build Falha
- Verifique os logs de build no Render
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se o Node.js está na versão correta

### Aplicação não Carrega
- Verifique as variáveis de ambiente
- Teste o endpoint `/api/health`
- Verifique os logs da aplicação

### Erro de CORS
- Verifique se `FRONTEND_URL` está configurado corretamente
- Em produção, o frontend e backend rodam no mesmo domínio

### Erro de Banco de Dados
- Verifique as credenciais do Supabase
- Certifique-se de que as migrações foram executadas
- Verifique as políticas RLS no Supabase

## Custos

### Render (Plano Gratuito)
- 750 horas/mês de runtime
- Sleep após 15 minutos de inatividade
- Bandwidth limitado

### Supabase (Plano Gratuito)
- 500MB de banco de dados
- 1GB de storage
- 2GB de bandwidth

### Google Gemini (Plano Gratuito)
- Limite de requisições por minuto
- Cota mensal gratuita

## Próximos Passos

1. **Monitoramento**: Configure alertas para uptime
2. **Backup**: Implemente rotina de backup dos dados
3. **SSL**: O Render fornece SSL automático
4. **CDN**: Para melhor performance global
5. **Logs**: Configure agregação de logs para análise

## Suporte

- **Render**: [Documentação oficial](https://render.com/docs)
- **Supabase**: [Documentação](https://supabase.com/docs)
- **Issues**: Use o GitHub Issues do projeto para reportar problemas