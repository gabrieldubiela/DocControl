import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const SignatureList = styled.div`
  margin-top: 1rem;
`;

const SignatureItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SignatureEmail = styled.div`
  font-weight: bold;
`;

const SignatureDate = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
`;

const SignButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  width: 100%;
  
  &:hover {
    background-color: #27ae60;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const NoSignatures = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem 0;
`;

const SignatureModal = ({ 
  isOpen, 
  onClose, 
  documentId, 
  onSign, 
  signatures, 
  loading, 
  hasSigned 
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Assinaturas do Documento</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        {signatures.length === 0 ? (
          <NoSignatures>Nenhuma assinatura registrada</NoSignatures>
        ) : (
          <SignatureList>
            {signatures.map(signature => (
              <SignatureItem key={signature.id}>
                <SignatureEmail>{signature.usuarios.email}</SignatureEmail>
                <SignatureDate>
                  Assinado em: {new Date(signature.data_assinatura).toLocaleString()}
                </SignatureDate>
              </SignatureItem>
            ))}
          </SignatureList>
        )}
        
        {!hasSigned && (
          <SignButton 
            onClick={onSign}
            disabled={loading}
          >
            {loading ? 'Assinando...' : 'Assinar Documento'}
          </SignButton>
        )}
        
        {hasSigned && (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#2ecc71' }}>
            Você já assinou este documento
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignatureModal;