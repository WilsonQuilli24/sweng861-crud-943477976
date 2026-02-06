import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? 'http://localhost:5002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=unauthorized';
    }
    return Promise.reject(error);
  }
);

export async function apiFetch(path, options = {}) {
  const { method = 'GET', data, body, params, headers } = options;
  const res = await api.request({
    url: path,
    method: method.toUpperCase(),
    data: body ?? data,
    params,
    headers,
  });
  return res.data;
}

export async function apiPost(path, data = {}, options = {}) {
  const res = await api.post(path, data, options);
  return res.data;
}

export async function apiPut(path, data = {}, options = {}) {
  const res = await api.put(path, data, options);
  return res.data;
}

export default api;