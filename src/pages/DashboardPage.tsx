// src/pages/Dashboard.tsx
import React from 'react';
import CharacterEditor from '../components/CharacterEditor';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <CharacterEditor />
    </div>
  );
};

export default DashboardPage;
