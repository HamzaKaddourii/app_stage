import axios from 'axios';
import { API_URL, getAuthHeaders } from '../utils/config';

// Service de gestion des réservations
const reservationService = {
  // Récupérer toutes les réservations (avec filtres optionnels)
  getReservations: async (filters = {}) => {
    try {
      let url = `${API_URL}/reservations`;
      if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value);
          }
        });
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer une réservation par son ID
  getReservation: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer les réservations d'un utilisateur
  getUserReservations: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user-reservations/${userId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer les réservations d'une salle
  getSalleReservations: async (salleId) => {
    try {
      const response = await axios.get(`${API_URL}/salle-reservations/${salleId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Créer une nouvelle réservation
  createReservation: async (reservationData) => {
    try {
      const response = await axios.post(`${API_URL}/reservations`, reservationData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Mettre à jour une réservation (statut ou autres détails)
  updateReservation: async (id, reservationData) => {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}`, reservationData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Annuler/supprimer une réservation
  cancelReservation: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reservations/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  }
};

export default reservationService;
