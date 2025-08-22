import React, { useState } from 'react';
import { useModels } from '../hooks/useModels';
import ModelForm from '../components/ModelForm';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h2`
  color: #2c3e50;
`;

const AddButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const ModelListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ModelItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ModelInfo = styled.div`
  flex: 1;
`;

const ModelName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const ModelMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

const ModelActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#3498db';
      case 'danger': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ModelsPage = () => {
  const { 
    models, 
    loading, 
    error, 
    createModel,
    updateModel,
    deleteModel
  } = useModels();
  
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState(null);

  const handleAddModel = () => {
    setEditingModel(null);
    setShowForm(true);
  };

  const handleEditModel = (model) => {
    setEditingModel(model);
    setShowForm(true);
  };

  const handleDeleteModel = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      const result = await deleteModel(id);
      if (result.success) {
        toast.success('Modelo excluído com sucesso');
      } else {
        toast.error(result.error || 'Erro ao excluir modelo');
      }
    }
  };

  const handleSaveModel = async (modelData) => {
    let result;
    
    if (editingModel) {
      result = await updateModel(editingModel.id, modelData);
    } else {
      result = await createModel(modelData);
    }
    
    if (result.success) {
      toast.success(editingModel ? 'Modelo atualizado com sucesso' : 'Modelo criado com sucesso');
      setShowForm(false);
      setEditingModel(null);
    } else {
      toast.error(result.error || 'Erro ao salvar modelo');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingModel(null);
  };

  return (
    <DashboardContainer>
      <Header />
      <Content>
        <PageHeader>
          <PageTitle>Modelos de Documentos</PageTitle>
          <AddButton onClick={handleAddModel}>Novo Modelo</AddButton>
        </PageHeader>
        
        {showForm ? (
          <ModelForm
            model={editingModel}
            onSave={handleSaveModel}
            onCancel={handleCancelForm}
          />
        ) : (
          <>
            {loading && <p>Carregando modelos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
              <ModelListContainer>
                {models.length === 0 ? (
                  <p style={{ padding: '1rem' }}>Nenhum modelo encontrado.</p>
                ) : (
                  models.map(model => (
                    <ModelItem key={model.id}>
                      <ModelInfo>
                        <ModelName>{model.nome}</ModelName>
                        <ModelMeta>
                          {model.tipo_documento}
                        </ModelMeta>
                      </ModelInfo>
                      <ModelActions>
                        <ActionButton variant="primary" onClick={() => handleEditModel(model)}>
                          Editar
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => handleDeleteModel(model.id)}>
                          Excluir
                        </ActionButton>
                      </ModelActions>
                    </ModelItem>
                  ))
                )}
              </ModelListContainer>
            )}
          </>
        )}
      </Content>
    </DashboardContainer>
  );
};

export default ModelsPage;