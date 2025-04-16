import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Création du contexte d'authentification
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialisation de l'état de l'utilisateur au chargement
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Fonction pour connecter un utilisateur
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setCurrentUser(data.user);
    return data;
  };

  // Fonction pour inscrire un nouvel utilisateur
  const register = async (userData) => {
    const data = await authService.register(userData);
    setCurrentUser(data.user);
    return data;
  };

  // Fonction pour déconnecter un utilisateur
  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  // Vérifier si l'utilisateur est un administrateur
  const isAdmin = () => {
    return currentUser && currentUser.role === 'administrateur';
  };

  // Fonction pour mettre à jour les informations de l'utilisateur
  const updateUser = async (userData) => {
    const data = await authService.updateUser(userData);
    setCurrentUser(data.user);
    return data;
  };

  // Valeurs fournies par le contexte
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
