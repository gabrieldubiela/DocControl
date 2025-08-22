import { useState, useEffect } from 'react';
import { modelService } from '../services/modelService';

export function useModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await modelService.getAll();
      setModels(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar modelos');
    } finally {
      setLoading(false);
    }
  };

  const createModel = async (modelData) => {
    try {
      const newModel = await modelService.create(modelData);
      setModels([...models, newModel]);
      return { success: true, model: newModel };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao criar modelo' 
      };
    }
  };

  const updateModel = async (id, modelData) => {
    try {
      const updatedModel = await modelService.update(id, modelData);
      setModels(models.map(model => model.id === id ? updatedModel : model));
      return { success: true, model: updatedModel };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao atualizar modelo' 
      };
    }
  };

  const deleteModel = async (id) => {
    try {
      await modelService.delete(id);
      setModels(models.filter(model => model.id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao excluir modelo' 
      };
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    error,
    fetchModels,
    createModel,
    updateModel,
    deleteModel
  };
}