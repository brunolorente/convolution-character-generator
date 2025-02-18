// src/services/authService.ts
import api from './apiClient';

export const loginService = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data.token; // Solo devolvemos el token
};

export const logoutService = async () => {
  await api.post('/logout');
};

export const getUserProfile = async () => {
  const response = await api.get('/user');
  return response.data;
};
