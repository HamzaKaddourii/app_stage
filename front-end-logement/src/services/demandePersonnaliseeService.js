import axios from 'axios';
import { API_URL, getAuthHeaders } from '../utils/config';

// Service de gestion des demandes personnalisées de "salle de rêve"
const demandePersonnaliseeService = {
  // Récupérer toutes les demandes personnalisées (admin voit tout, utilisateur voit seulement les siennes)
  getDemandes: async () => {
    try {
      const response = await axios.get(`${API_URL}/demandes-personnalisees`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer une demande personnalisée par son ID
  getDemande: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/demandes-personnalisees/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Créer une nouvelle demande personnalisée
  createDemande: async (demandeData) => {
    try {
      const response = await axios.post(`${API_URL}/demandes-personnalisees`, demandeData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Mettre à jour une demande personnalisée
  updateDemande: async (id, demandeData) => {
    try {
      const response = await axios.put(`${API_URL}/demandes-personnalisees/${id}`, demandeData, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Supprimer une demande personnalisée
  deleteDemande: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/demandes-personnalisees/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Récupérer toutes les demandes en attente (admin only)
  getPendingDemandes: async () => {
    try {
      const response = await axios.get(`${API_URL}/pending-demands`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  },

  // Obtenir des suggestions de salles existantes correspondant aux critères de la demande
  getSuggestions: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/demandes-personnalisees/${id}/suggestions`, getAuthHeaders());
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Erreur de connexion au serveur' };
    }
  }
};

export default demandePersonnaliseeService;
