import api from './api';

export const documentService = {
  async getAll() {
    const response = await api.get('/documents');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/documents', data);
    return response.data;
  },

  async generateContent(prompt, tipo_documento) {
    const response = await api.post('/documents/generate-content', { prompt, tipo_documento });
    return response.data;
  },

  async generatePdf(id) {
    const response = await api.post(`/documents/${id}/generate-pdf`);
    return response.data;
  }
};