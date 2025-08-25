const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Importar rotas do backend
const authRoutes = require('./backend/src/routes/auth');
const documentRoutes = require('./backend/src/routes/documents');
const modelRoutes = require('./backend/src/routes/models');
const signatureRoutes = require('./backend/src/routes/signatures');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.gemini.google.com", "https://*.supabase.co"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-app.onrender.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/signatures', signatureRoutes);

// Rota de verificação de saúde
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  // Servir arquivos estáticos do build do React
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  
  // Todas as rotas não-API devem retornar o index.html (para React Router)
  app.get('*', (req, res) => {
    // Verificar se não é uma rota da API
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    } else {
      res.status(404).json({ error: 'Rota da API não encontrada' });
    }
  });
} else {
  // Em desenvolvimento, mostrar mensagem informativa
  app.get('/', (req, res) => {
    res.json({
      message: 'Servidor de desenvolvimento rodando',
      frontend: 'http://localhost:3000',
      api: `http://localhost:${PORT}/api`
    });
  });
}

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Aplicação disponível em: https://your-app.onrender.com`);
  } else {
    console.log(`🔧 API: http://localhost:${PORT}/api`);
    console.log(`🎨 Frontend: http://localhost:3000`);
  }
});

module.exports = app;