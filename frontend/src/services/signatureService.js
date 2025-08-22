import api from './api';

export const signatureService = {
  async signDocument(documentId) {
    try {
      const response = await api.post(`/signatures/${documentId}`);
      return { success: true, signature: response.data.signature };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao assinar documento' 
      };
    }
  },

  async getDocumentSignatures(documentId) {
    const response = await api.get(`/signatures/${documentId}`);
    return response.data;
  }
};