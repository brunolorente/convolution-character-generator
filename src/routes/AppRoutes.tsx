// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';
import EditCharacterPage from '../pages/character/EditCharacterPage';
import AgentDetailPage from '../pages/character/CharacterDetailPage';
import CreateCharacterPage from '../pages/character/CreateCharacterPage';
import PublicLayout from '../components/layouts/public/PublicLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      } />
      <Route path="/login" element={
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      } />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute pageTitle='Dashboard'>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/:id"
        element={
          <PrivateRoute pageTitle='Agent data'>
            <AgentDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/character/:id"
        element={
          <PrivateRoute pageTitle='Edit character'>
            <EditCharacterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/character"
        element={
          <PrivateRoute pageTitle='Create character'>
            <CreateCharacterPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
