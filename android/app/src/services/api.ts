import axios from 'axios';
import { Platform } from 'react-native';
import { getToken } from './authToken';

const isAndroid = Platform.OS === 'android';

// URL base da API
const API_URL = isAndroid
  ? 'http://10.0.2.2:5255/api'
  : 'http://localhost:5255/api';

// Criação da instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inserir o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
