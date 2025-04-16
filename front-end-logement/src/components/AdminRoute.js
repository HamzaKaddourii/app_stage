import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant de route protégée pour les administrateurs uniquement
 * Redirige vers la page d'accueil si l'utilisateur n'est pas connecté ou n'est pas administrateur
 */
const AdminRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // Pendant le chargement de l'authentification, on ne fait rien
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }
  
  // Si l'utilisateur n'est pas connecté ou n'est pas admin, on redirige vers la page d'accueil
  if (!currentUser || currentUser.role !== 'administrateur') {
    return <Navigate to="/" replace />;
  }
  
  // Sinon, on affiche le contenu de la route
  return <Outlet />;
};

export default AdminRoute;
