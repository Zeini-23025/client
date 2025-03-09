import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: "http://localhost:8000", 
  headers: { "Content-Type": "application/json" },
});
  

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pour gérer les erreurs de réponse, notamment pour les 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Si le token d'accès est expiré, tente de rafraîchir le token
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:8000/api/token/refresh/",
            { refresh: refreshToken }
          );
          // Enregistrer le nouveau token d'accès
          localStorage.setItem(ACCESS_TOKEN, refreshResponse.data.access);
          // Relancer la requête d'origine avec le nouveau token
          return api(error.config);
        } catch (err) {
          // Si le rafraîchissement échoue, supprimer les tokens et rediriger l'utilisateur
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);


const apiServices = {
  auth: {
    register: (userData) => api.post('/register/', userData),
    login: (credentials) => api.post('/login/', credentials),
    logout: (refreshToken) => api.post('/logout/', { refresh_token: refreshToken }),
    checkAuth: (tokens) => api.post('/check-auth/', tokens),
    requestPasswordReset: (email) => api.post('/request-update-password/', { email }),
    verifyAndUpdatePassword: (data) => api.post('/verify-update-password/', data),
    requestEmailUpdate: (newEmail) => api.post('/request-update-email/', { new_email: newEmail }),
    verifyAndUpdateEmail: (data) => api.post('/verify-update-email/', data),
  },

  admin: {
    // Admin only endpoints
    getAdminData: () => api.get('/admin-only/'),
  },

  user: {
    // User only endpoints
    getUserData: () => api.get('/user-only/'),
  },

  matieres: {
    list: () => api.get('/api/matieres/'),
    create: (matiereData) => api.post('/api/matieres/', matiereData),
    update: (id, matiereData) => api.put(`/api/matieres/${id}/`, matiereData),
    delete: (id) => api.delete(`/api/matieres/${id}/`),
  },

  enseignants: {
    list: () => api.get('/api/enseignants/'),
    create: (enseignantData) => api.post('/api/enseignants/', enseignantData),
    update: (id, enseignantData) => api.put(`/api/enseignants/${id}/`, enseignantData),
    delete: (id) => api.delete(`/api/enseignants/${id}/`),
  },

  groupes: {
    list: () => api.get('/api/groupes/'),
    create: (groupeData) => api.post('/api/groupes/', groupeData),
    update: (id, groupeData) => api.put(`/api/groupes/${id}/`, groupeData),
    delete: (id) => api.delete(`/api/groupes/${id}/`),
    getMatieres: (id) => api.get(`/api/groupes/${id}/matieres/`),
  },

  disponibilites: {
    list: () => api.get('/api/disponibilites/'),
    create: (disponibiliteData) => api.post('/api/disponibilites/', disponibiliteData),
    reconduire: (data) => api.post('/api/reconduire/', data),
  },

  calendrier: {
    list: () => api.get('/api/calendrier/'),
    create: (calendrierData) => api.post('/api/calendrier/', calendrierData),
    ajouterException: (exceptionData) => api.post('/api/ajouter-exception/', exceptionData),
    supprimerJour: (jourData) => api.post('/api/supprimer-jour/', jourData),
  },

  chargesHebdo: {
    list: () => api.get('/api/charges/'),
    create: (chargeData) => api.post('/api/charges/', chargeData),
    reconduire: (data) => api.post('/api/charges-reconduire/', data),
  },

  affectationsEnseignant: {
    list: () => api.get('/api/affectations-enseignant/'),
    create: (affectationData) => api.post('/api/affectations-enseignant/', affectationData),
  },

  contraintesHoraires: {
    list: () => api.get('/api/contraintes_horaires/'),
    create: (contrainteData) => api.post('/api/contraintes_horaires/', contrainteData),
  },

  emploiTemps: {
    list: () => api.get('/api/emploi-temps/'),
    create: (emploiTempsData) => api.post('/api/emploi-temps/', emploiTempsData),
  },

  clearAuth: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
};

export { api as default, apiServices };
