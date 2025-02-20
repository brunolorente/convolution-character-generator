// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PrivateRoute from './PrivateRoute';
import EditCharacterPage from '../pages/character/EditCharacterPage';
import AgentDetailPage from '../pages/character/CharacterDetailPage';
import CreateCharacterPage from '../pages/character/CreateCharacterPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Priva routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/:id"
        element={
          <PrivateRoute>
            <AgentDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/character/:id"
        element={
          <PrivateRoute>
            <EditCharacterPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/agent/character"
        element={
          <PrivateRoute>
            <CreateCharacterPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
