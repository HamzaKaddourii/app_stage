// Configuration de l'API
export const API_URL = 'http://localhost:8000/api';

// Configuration des tokens d'authentification
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('Aucun token d\'authentification trouvé');
  }
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  };
};
