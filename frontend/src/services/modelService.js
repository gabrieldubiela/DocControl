import api from './api';

export const modelService = {
  async getAll() {
    const response = await api.get('/models');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/models', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/models/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/models/${id}`);
  }
};