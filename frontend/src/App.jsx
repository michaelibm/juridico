import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListaProcessos from './pages/processos/ListaProcessos';
import NovoProcesso from './pages/processos/NovoProcesso';
import DetalhesProcesso from './pages/processos/DetalhesProcesso';
import NovaMovimentacao from './pages/processos/NovaMovimentacao';
import Usuarios from './pages/admin/Usuarios';
import Logs from './pages/admin/Logs';
import ConsultaDatajud from './pages/ConsultaDatajud';

const RotaProtegida = ({ children, soAdmin = false }) => {
  const { usuario, carregando, isAdmin } = useAuth();
  if (carregando) return <LoadingSpinner texto="Verificando sessão..." />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (soAdmin && !isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  const { usuario, carregando } = useAuth();
  if (carregando) return <LoadingSpinner texto="Carregando..." />;

  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={
        <RotaProtegida><Dashboard /></RotaProtegida>
      } />

      <Route path="/processos" element={
        <RotaProtegida><ListaProcessos /></RotaProtegida>
      } />
      <Route path="/processos/novo" element={
        <RotaProtegida><NovoProcesso /></RotaProtegida>
      } />
      <Route path="/processos/:id" element={
        <RotaProtegida><DetalhesProcesso /></RotaProtegida>
      } />
      <Route path="/processos/:id/movimentacao" element={
        <RotaProtegida><NovaMovimentacao /></RotaProtegida>
      } />

      <Route path="/consulta-datajud" element={
        <RotaProtegida><ConsultaDatajud /></RotaProtegida>
      } />

      <Route path="/admin/usuarios" element={
        <RotaProtegida soAdmin><Usuarios /></RotaProtegida>
      } />
      <Route path="/admin/logs" element={
        <RotaProtegida soAdmin><Logs /></RotaProtegida>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
