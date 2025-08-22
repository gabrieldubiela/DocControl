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

const ModelForm = ({ model, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo_documento: 'despacho',
    conteudo_html: ''
  });

  useEffect(() => {
    if (model) {
      setFormData({
        nome: model.nome,
        tipo_documento: model.tipo_documento,
        conteudo_html: model.conteudo_html
      });
    }
  }, [model]);

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

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="nome">Nome do Modelo</Label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
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
          <Label>Conteúdo do Modelo (use {'{{CONTEUDO}}'} como placeholder)</Label>
          <EditorContainer>
            <ReactQuill
              value={formData.conteudo_html}
              onChange={handleContentChange}
            />
          </EditorContainer>
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" variant="primary">Salvar</Button>
          <Button type="button" onClick={onCancel}>Cancelar</Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default ModelForm;