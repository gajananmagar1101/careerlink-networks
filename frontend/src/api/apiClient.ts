import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/domain';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('careerlink.token') ?? window.sessionStorage.getItem('careerlink.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      window.localStorage.removeItem('careerlink.token');
      window.localStorage.removeItem('careerlink.user');
      window.sessionStorage.removeItem('careerlink.token');
      window.sessionStorage.removeItem('careerlink.user');
      window.dispatchEvent(new Event('careerlink:unauthorized'));
    }

    const apiError: ApiError = {
      status: error.response?.status ?? 503,
      message: toFriendlyError(error)
    };
    return Promise.reject(apiError);
  }
);

export function toFriendlyError(error: unknown) {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  const status = axiosError.response?.status;
  const backendMessage = axiosError.response?.data?.message?.trim();
  if (!status) return 'CareerLink cannot reach the API Gateway. Confirm the backend is running.';
  if (status === 400) return backendMessage || 'Please check the highlighted details and try again.';
  if (status === 401) return backendMessage || 'Your session has expired. Please sign in again.';
  if (status === 403) return backendMessage || 'You do not have permission to perform this action.';
  if (status === 404) return backendMessage || 'We could not find the requested resource.';
  if (status === 409) return backendMessage || 'This action conflicts with an existing record.';
  if (status >= 500) return backendMessage || 'The backend could not complete the request right now.';
  return backendMessage || 'Something went wrong. Please try again.';
}

export async function unwrap<T>(request: Promise<{ data: { data: T } }>) {
  const response = await request;
  return response.data.data;
}
