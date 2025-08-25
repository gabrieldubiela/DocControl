# Sistema de Gerenciamento de Documentos

Um sistema completo para gerenciamento de documentos com geração automática de conteúdo usando IA, assinaturas digitais e geração de PDFs.

## Funcionalidades

- **Autenticação e Autorização**: Sistema de login com controle por setores
- **Geração de Documentos**: Criação de documentos com templates personalizáveis
- **IA Integrada**: Geração automática de conteúdo usando Google Gemini
- **Assinaturas Digitais**: Sistema de assinatura de documentos
- **Geração de PDF**: Conversão automática de documentos para PDF
- **Modelos**: Sistema de templates para diferentes tipos de documentos

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL)
- Google Gemini AI
- Puppeteer (geração de PDF)
- JWT (autenticação)

### Frontend
- React.js
- React Router
- Styled Components
- React Quill (editor de texto)
- Axios (requisições HTTP)

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Conta no Supabase
- Chave da API do Google Gemini

## Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd gerenciador-documentos
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `JWT_SECRET`: Uma string secreta para JWT
- `SUPABASE_URL`: URL do seu projeto Supabase
- `SUPABASE_KEY`: Chave pública do Supabase
- `GEMINI_API_KEY`: Chave da API do Google Gemini

### 3. Configuração do Frontend

```bash
cd ../frontend
npm install
```

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as variáveis no arquivo `.env`:
- `REACT_APP_API_URL`: URL da API backend
- `REACT_APP_SUPABASE_URL`: URL do Supabase
- `REACT_APP_SUPABASE_KEY`: Chave pública do Supabase

### 4. Configuração do Banco de Dados

Execute as migrações SQL no seu projeto Supabase usando o arquivo:
`supabase/migrations/create_initial_schema.sql`

### 5. Configuração do Storage no Supabase

1. Acesse o painel do Supabase
2. Vá para Storage
3. Crie um bucket chamado `documentos`
4. Configure as políticas de acesso conforme necessário

## Executando o Projeto

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

O sistema estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Estrutura do Projeto

```
gerenciador-documentos/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (Supabase, Gemini)
│   │   ├── controllers/     # Controladores da API
│   │   ├── middleware/      # Middlewares (autenticação)
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Serviços (PDF, IA, assinaturas)
│   │   └── server.js        # Servidor principal
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   └── App.js           # Componente principal
│   └── package.json
├── supabase/
│   └── migrations/          # Migrações do banco de dados
└── README.md
```

## Uso

1. **Registro/Login**: Crie uma conta ou faça login
2. **Modelos**: Crie templates para diferentes tipos de documentos
3. **Documentos**: Crie novos documentos usando os modelos
4. **IA**: Use a funcionalidade de IA para gerar conteúdo automaticamente
5. **PDF**: Gere PDFs dos documentos criados
6. **Assinaturas**: Assine documentos digitalmente

## Tipos de Documentos Suportados

- Despacho
- Ofício
- Parecer
- Memorando
- Relatório

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.