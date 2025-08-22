import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ModelsPage from './pages/ModelsPage';
import Header from './components/Header';
import styled from 'styled-components';

const Navigation = styled.nav`
  background-color: #34495e;
  padding: 1rem 2rem;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-right: 1rem;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: #3498db;
  }
`;

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} />
        {isAuthenticated && <Header />}
        {isAuthenticated && (
          <Navigation>
            <NavList>
              <NavItem>
                <NavLink href="/" className="active">Documentos</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/models">Modelos</NavLink>
              </NavItem>
            </NavList>
          </Navigation>
        )}
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/models" 
            element={isAuthenticated ? <ModelsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;