import axios from 'axios';
import { API_URL, getAuthHeaders } from '../utils/config';

// Service de gestion des bons d'achat
const bonAchatService = {
  // Récupérer tous les bons d'achat de l'utilisateur
  getBonsAchat: async () => {
    try {
      const response = await axios.get(`${API_URL}/bons-achat`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer un bon d'achat par son ID
  getBonAchat: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/bons-achat/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Utiliser un bon d'achat
  useBonAchat: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/bons-achat/${id}`, { is_used: true }, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Créer un nouveau bon d'achat
  createBonAchat: async (bonAchatData) => {
    try {
      const response = await axios.post(`${API_URL}/bons-achat`, bonAchatData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  }
};

export default bonAchatService;
