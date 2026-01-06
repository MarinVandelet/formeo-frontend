import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // adapte si ton back n'est pas là
});

// Ajout automatique du token si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
