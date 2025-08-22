import { useState } from 'react';
import { signatureService } from '../services/signatureService';

export function useSignatures() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signDocument = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signatureService.signDocument(documentId);
      return result;
    } catch (err) {
      setError(err.message || 'Erro ao assinar documento');
      return { success: false, error: err.message || 'Erro ao assinar documento' };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentSignatures = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      const signatures = await signatureService.getDocumentSignatures(documentId);
      return { success: true, data: signatures };
    } catch (err) {
      setError(err.message || 'Erro ao buscar assinaturas');
      return { success: false, error: err.message || 'Erro ao buscar assinaturas' };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signDocument,
    getDocumentSignatures
  };
}