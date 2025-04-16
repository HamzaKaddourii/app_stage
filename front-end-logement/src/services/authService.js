import axios from 'axios';
import { API_URL, getAuthHeaders } from '../utils/config';

// Service d'authentification
const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, getAuthHeaders());
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur est un administrateur
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'administrateur';
  },

  // Mettre à jour les informations de l'utilisateur
  updateUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/user/update`, userData, getAuthHeaders());
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Demander un lien de réinitialisation de mot de passe
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Vérifier si un token de réinitialisation est valide
  checkResetToken: async (token, email) => {
    try {
      const response = await axios.get(`${API_URL}/reset-password/check`, {
        params: { token, email }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Réinitialiser le mot de passe avec le token
  resetPassword: async (token, email, password, password_confirmation) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        email,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },
};

export default authService;
