/*
  # Criação do esquema inicial do sistema de gerenciamento de documentos

  1. Novas Tabelas
    - `setores`
      - `id` (integer, primary key)
      - `nome` (text, nome do setor)
      - `created_at` (timestamp)
    - `usuarios`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `senha` (text, hash da senha)
      - `setor_id` (integer, foreign key)
      - `created_at` (timestamp)
    - `modelos`
      - `id` (uuid, primary key)
      - `nome` (text, nome do modelo)
      - `tipo_documento` (text, tipo do documento)
      - `conteudo_html` (text, template HTML)
      - `setor_id` (integer, foreign key)
      - `created_at` (timestamp)
    - `documentos`
      - `id` (uuid, primary key)
      - `titulo` (text, título do documento)
      - `tipo_documento` (text, tipo do documento)
      - `numero_documento` (integer, número sequencial)
      - `conteudo_html` (text, conteúdo do documento)
      - `links_pdf` (jsonb, array de URLs dos PDFs)
      - `setor_id` (integer, foreign key)
      - `created_at` (timestamp)
    - `assinaturas`
      - `id` (uuid, primary key)
      - `documento_id` (uuid, foreign key)
      - `usuario_id` (uuid, foreign key)
      - `data_assinatura` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados acessarem apenas dados do seu setor
*/

-- Criar tabela de setores
CREATE TABLE IF NOT EXISTS setores (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir setores padrão
INSERT INTO setores (nome) VALUES 
  ('Administração'),
  ('Financeiro'),
  ('Recursos Humanos'),
  ('Jurídico'),
  ('TI')
ON CONFLICT DO NOTHING;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  setor_id INTEGER NOT NULL REFERENCES setores(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de modelos
CREATE TABLE IF NOT EXISTS modelos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  conteudo_html TEXT NOT NULL,
  setor_id INTEGER NOT NULL REFERENCES setores(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela de documentos
CREATE TABLE IF NOT EXISTS documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  numero_documento INTEGER NOT NULL,
  conteudo_html TEXT NOT NULL,
  links_pdf JSONB DEFAULT '[]'::jsonb,
  setor_id INTEGER NOT NULL REFERENCES setores(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tipo_documento, numero_documento, setor_id)
);

-- Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_id UUID NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  data_assinatura TIMESTAMPTZ DEFAULT now(),
  UNIQUE(documento_id, usuario_id)
);

-- Habilitar RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinaturas ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver dados do próprio setor"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

-- Políticas para modelos
CREATE POLICY "Usuários podem ver modelos do próprio setor"
  ON modelos
  FOR SELECT
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar modelos no próprio setor"
  ON modelos
  FOR INSERT
  TO authenticated
  WITH CHECK (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar modelos do próprio setor"
  ON modelos
  FOR UPDATE
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

CREATE POLICY "Usuários podem excluir modelos do próprio setor"
  ON modelos
  FOR DELETE
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

-- Políticas para documentos
CREATE POLICY "Usuários podem ver documentos do próprio setor"
  ON documentos
  FOR SELECT
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

CREATE POLICY "Usuários podem criar documentos no próprio setor"
  ON documentos
  FOR INSERT
  TO authenticated
  WITH CHECK (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar documentos do próprio setor"
  ON documentos
  FOR UPDATE
  TO authenticated
  USING (setor_id = (
    SELECT setor_id FROM usuarios WHERE id = auth.uid()
  ));

-- Políticas para assinaturas
CREATE POLICY "Usuários podem ver assinaturas de documentos do próprio setor"
  ON assinaturas
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM documentos d 
    WHERE d.id = documento_id 
    AND d.setor_id = (
      SELECT setor_id FROM usuarios WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Usuários podem criar assinaturas em documentos do próprio setor"
  ON assinaturas
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM documentos d 
    WHERE d.id = documento_id 
    AND d.setor_id = (
      SELECT setor_id FROM usuarios WHERE id = auth.uid()
    )
  ));

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_setor_id ON usuarios(setor_id);
CREATE INDEX IF NOT EXISTS idx_modelos_setor_id ON modelos(setor_id);
CREATE INDEX IF NOT EXISTS idx_modelos_tipo_documento ON modelos(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_documentos_setor_id ON documentos(setor_id);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo_documento ON documentos(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_assinaturas_documento_id ON assinaturas(documento_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario_id ON assinaturas(usuario_id);