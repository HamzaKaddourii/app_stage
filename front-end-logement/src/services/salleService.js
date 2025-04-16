import axios from 'axios';
import { API_URL, getAuthHeaders } from '../utils/config';

// Service de gestion des salles
const salleService = {
  // Récupérer toutes les salles avec filtres optionnels
  getSalles: async (filters = {}) => {
    try {
      // Construire l'URL avec les paramètres de filtre
      let url = `${API_URL}/salles`;
      if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value);
          }
        });
        url += `?${params.toString()}`;
      }
      
      console.log('Récupération des salles avec URL:', url);
      const response = await axios.get(url, getAuthHeaders());
      console.log('Réponse du serveur pour getSalles:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getSalles:', error);
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer une salle par son ID
  getSalle: async (id) => {
    try {
      console.log('Récupération de la salle avec ID:', id);
      const response = await axios.get(`${API_URL}/salles/${id}`, getAuthHeaders());
      console.log('Réponse du serveur pour getSalle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getSalle:', error);
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Créer une nouvelle salle (admin uniquement)
  createSalle: async (formData) => {
    try {
      // Récupérer les en-têtes d'authentification
      const authHeader = getAuthHeaders().headers;
      
      // Utilisez FormData directement sans le transformer en JSON
      console.log('Création d\'une nouvelle salle avec données:', formData);
      const response = await axios.post(`${API_URL}/salles`, formData, {
        headers: {
          // Inclure uniquement l'en-tête Authorization, pas le Content-Type pour FormData
          'Authorization': authHeader.Authorization
        }
      });
      console.log('Réponse du serveur pour createSalle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans createSalle:', error);
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Mettre à jour une salle (admin uniquement)
  updateSalle: async (id, formData) => {
    try {
      // Récupérer les en-têtes d'authentification
      const authHeader = getAuthHeaders().headers;
      
      // Utilisez FormData directement sans le transformer en JSON
      console.log('Mise à jour de la salle avec ID:', id, 'et données:', formData);
      const response = await axios.post(`${API_URL}/salles/${id}?_method=PUT`, formData, {
        headers: {
          // Inclure uniquement l'en-tête Authorization, pas le Content-Type pour FormData
          'Authorization': authHeader.Authorization
        }
      });
      console.log('Réponse du serveur pour updateSalle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans updateSalle:', error);
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Supprimer une salle (admin uniquement)
  deleteSalle: async (id) => {
    try {
      console.log('Suppression de la salle avec ID:', id);
      const response = await axios.delete(`${API_URL}/salles/${id}`, getAuthHeaders());
      console.log('Réponse du serveur pour deleteSalle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur dans deleteSalle:', error);
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },
};

export default salleService;
