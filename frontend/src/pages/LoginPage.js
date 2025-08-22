import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
`;

const ToggleMode = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setorId, setSetorId] = useState('1');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const result = await register(email, password, parseInt(setorId));
        if (!result.success) {
          setError(result.error || 'Erro ao registrar');
        }
      } else {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || 'Erro ao fazer login');
        }
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>{isRegister ? 'Registrar' : 'Login'}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          {isRegister && (
            <FormGroup>
              <Label htmlFor="setor">Setor</Label>
              <Select
                id="setor"
                value={setorId}
                onChange={(e) => setSetorId(e.target.value)}
              >
                <option value="1">Administração</option>
                <option value="2">Financeiro</option>
                <option value="3">Recursos Humanos</option>
                <option value="4">Jurídico</option>
                <option value="5">TI</option>
              </Select>
            </FormGroup>
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : (isRegister ? 'Registrar' : 'Entrar')}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ToggleMode type="button" onClick={toggleMode}>
            {isRegister 
              ? 'Já tem uma conta? Faça login' 
              : 'Não tem uma conta? Registre-se'}
          </ToggleMode>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;