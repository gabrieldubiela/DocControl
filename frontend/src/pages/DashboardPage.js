import React, { useState } from 'react';
import { useDocuments } from '../hooks/useDocuments';
import { useSignatures } from '../hooks/useSignatures';
import DocumentForm from '../components/DocumentForm';
import SignatureModal from '../components/SignatureModal';
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

const DocumentListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const DocumentItem = styled.div`
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

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const DocumentMeta = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

const DocumentActions = styled.div`
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
      case 'secondary': return '#9b59b6';
      case 'danger': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DashboardPage = () => {
  const { 
    documents, 
    loading, 
    error, 
    createDocument,
    generateDocumentContent,
    generatePdf
  } = useDocuments();
  
  const { signDocument, getDocumentSignatures } = useSignatures();
  
  const [showForm, setShowForm] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [hasSigned, setHasSigned] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);

  const handleAddDocument = () => {
    setShowForm(true);
  };

  const handleGeneratePdf = async (document) => {
    const result = await generatePdf(document.id);
    if (result.success) {
      toast.success('PDF gerado com sucesso');
      window.open(result.pdfUrl, '_blank');
    } else {
      toast.error(result.error || 'Erro ao gerar PDF');
    }
  };

  const handleShowSignatures = async (document) => {
    setSelectedDocument(document);
    setShowSignatureModal(true);
    
    const result = await getDocumentSignatures(document.id);
    if (result.success) {
      setSignatures(result.data);
      
      // Verificar se o usuário já assinou
      const user = JSON.parse(localStorage.getItem('user'));
      const userSigned = result.data.some(sig => sig.usuario_id === user.id);
      setHasSigned(userSigned);
    } else {
      toast.error(result.error || 'Erro ao buscar assinaturas');
    }
  };

  const handleSignDocument = async () => {
    if (!selectedDocument) return;
    
    setSigningLoading(true);
    try {
      const result = await signDocument(selectedDocument.id);
      if (result.success) {
        toast.success('Documento assinado com sucesso');
        setHasSigned(true);
        
        // Atualizar a lista de assinaturas
        const signaturesResult = await getDocumentSignatures(selectedDocument.id);
        if (signaturesResult.success) {
          setSignatures(signaturesResult.data);
        }
      } else {
        toast.error(result.error || 'Erro ao assinar documento');
      }
    } catch (error) {
      toast.error('Erro ao assinar documento');
    } finally {
      setSigningLoading(false);
    }
  };

  const handleSaveDocument = async (documentData) => {
    const result = await createDocument(documentData);
    
    if (result.success) {
      toast.success('Documento criado com sucesso');
      setShowForm(false);
    } else {
      toast.error(result.error || 'Erro ao salvar documento');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleGenerateContent = async (prompt, tipo_documento) => {
    return await generateDocumentContent(prompt, tipo_documento);
  };

  return (
    <DashboardContainer>
      <Header />
      <Content>
        <PageHeader>
          <PageTitle>Documentos</PageTitle>
          <AddButton onClick={handleAddDocument}>Novo Documento</AddButton>
        </PageHeader>
        
        {showForm ? (
          <DocumentForm
            document={null}
            onSave={handleSaveDocument}
            onCancel={handleCancelForm}
            onGenerateContent={handleGenerateContent}
          />
        ) : (
          <>
            {loading && <p>Carregando documentos...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
              <DocumentListContainer>
                {documents.length === 0 ? (
                  <p style={{ padding: '1rem' }}>Nenhum documento encontrado.</p>
                ) : (
                  documents.map(document => (
                    <DocumentItem key={document.id}>
                      <DocumentInfo>
                        <DocumentTitle>{document.titulo}</DocumentTitle>
                        <DocumentMeta>
                          {document.tipo_documento} - Nº {document.numero_documento}
                        </DocumentMeta>
                      </DocumentInfo>
                      <DocumentActions>
                        <ActionButton variant="primary" onClick={() => handleGeneratePdf(document)}>
                          Gerar PDF
                        </ActionButton>
                        <ActionButton variant="secondary" onClick={() => handleShowSignatures(document)}>
                          Assinaturas
                        </ActionButton>
                      </DocumentActions>
                    </DocumentItem>
                  ))
                )}
              </DocumentListContainer>
            )}
          </>
        )}
      </Content>
      
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        documentId={selectedDocument?.id}
        onSign={handleSignDocument}
        signatures={signatures}
        loading={signingLoading}
        hasSigned={hasSigned}
      />
    </DashboardContainer>
  );
};

export default DashboardPage;