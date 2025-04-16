import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Composant pour les routes protégées qui nécessitent une authentification
const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la route nécessite des privilèges administrateur et que l'utilisateur n'est pas admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si tout est OK, afficher les composants enfants
  return <Outlet />;
};

export default ProtectedRoute;
