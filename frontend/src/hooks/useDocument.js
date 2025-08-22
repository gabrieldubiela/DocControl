import { useState, useEffect } from 'react';
import { documentService } from '../services/documentService';

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar documentos');
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (documentData) => {
    try {
      const newDocument = await documentService.create(documentData);
      setDocuments([...documents, newDocument]);
      return { success: true, document: newDocument };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao criar documento' 
      };
    }
  };

  const generateDocumentContent = async (prompt, tipo_documento) => {
    try {
      const { content } = await documentService.generateContent(prompt, tipo_documento);
      return { success: true, content };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao gerar conteúdo' 
      };
    }
  };

  const generatePdf = async (id) => {
    try {
      const { pdfUrl, document } = await documentService.generatePdf(id);
      setDocuments(documents.map(doc => doc.id === id ? document : doc));
      return { success: true, pdfUrl };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao gerar PDF' 
      };
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    generateDocumentContent,
    generatePdf
  };
}