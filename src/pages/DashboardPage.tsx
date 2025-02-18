// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import { Link } from 'react-router-dom'; // Assuming you're using React Router
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { characters, loading, error, pagination, refetch } = useCharacters(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Token: {token}</p>
      <button onClick={logout}>Logout</button>

      <h2>Characters List</h2>
      {loading && <p>Loading characters...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link to={`/agent/${character.id}`}>{character.id}</Link>  {character.definition.name}{/* Linking to detail page */}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1}>
          Previous
        </button>
        <span>Page {pagination.current_page} of {pagination.total_pages}</span>
        <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.total_pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
