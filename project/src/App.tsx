import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import AnamnesisFormPage from './pages/AnamnesisFormPage';
import AnamnesisHistoryPage from './pages/AnamnesisHistoryPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients/new" element={<PatientRegistrationPage />} />
        <Route path="/patients/:id/edit" element={<PatientRegistrationPage />} />
        <Route path="/anamnesis/new/:patientId" element={<AnamnesisFormPage />} />
        <Route path="/anamnesis/:id" element={<AnamnesisFormPage />} />
        <Route path="/anamnesis-history" element={<AnamnesisHistoryPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;