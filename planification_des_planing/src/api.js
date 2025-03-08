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
          // Vous pouvez ajouter ici la logique pour rediriger l'utilisateur vers la page de login
        }
      }
    }
    return Promise.reject(error);
  }
);


const apiServices = {

  // Auth services
  // auth: {
  //   login: (credentials) => api.post('/api/login/', credentials),
  //   verifyToken: () => api.post('/api/verify-token/'),
  //   getCurrentUser: () => {
  //     return {
  //       username: localStorage.getItem('username'),
  //       email: localStorage.getItem('email'),
  //     };
  //   },
  //   logout: () => {
  //     localStorage.removeItem('access_token');
  //     localStorage.removeItem('refresh_token');
  //     localStorage.removeItem('is_superuser');
  //   }
  // },
};

export { api as default, apiServices };
