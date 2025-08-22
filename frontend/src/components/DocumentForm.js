import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  background-color: ${props => props.variant === 'primary' ? '#3498db' : '#95a5a6'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const EditorContainer = styled.div`
  margin-top: 1rem;
  height: 300px;
`;

const AiSection = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const AiButton = styled.button`
  background-color: #9b59b6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DocumentForm = ({ document, onSave, onCancel, onGenerateContent }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo_documento: 'despacho',
    conteudo_html: ''
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (document) {
      setFormData({
        titulo: document.titulo,
        tipo_documento: document.tipo_documento,
        conteudo_html: document.conteudo_html
      });
    }
  }, [document]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, conteudo_html: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await onGenerateContent(aiPrompt, formData.tipo_documento);
      if (result.success && result.content) {
        setFormData(prev => ({ ...prev, conteudo_html: result.content || '' }));
      } else {
        alert(result.error || 'Erro ao gerar conteúdo');
      }
    } catch (error) {
      alert('Erro ao gerar conteúdo');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="titulo">Título</Label>
          <Input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tipo_documento">Tipo de Documento</Label>
          <Select
            id="tipo_documento"
            name="tipo_documento"
            value={formData.tipo_documento}
            onChange={handleChange}
            required
          >
            <option value="despacho">Despacho</option>
            <option value="oficio">Ofício</option>
            <option value="parecer">Parecer</option>
            <option value="memorando">Memorando</option>
            <option value="relatorio">Relatório</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Conteúdo</Label>
          <EditorContainer>
            <ReactQuill
              value={formData.conteudo_html}
              onChange={handleContentChange}
            />
          </EditorContainer>
        </FormGroup>

        <AiSection>
          <Label htmlFor="aiPrompt">Gerar conteúdo com IA</Label>
          <Input
            type="text"
            id="aiPrompt"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Descreva o conteúdo que deseja gerar..."
          />
          <AiButton 
            type="button" 
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            {isGenerating ? 'Gerando...' : 'Gerar Conteúdo'}
          </AiButton>
        </AiSection>

        <ButtonGroup>
          <Button type="submit" variant="primary">Salvar</Button>
          <Button type="button" onClick={onCancel}>Cancelar</Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default DocumentForm;