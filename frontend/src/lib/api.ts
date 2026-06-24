import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to add the auth token header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};

export const getCallsChartData = async () => {
  const { data } = await api.get('/calls/chart');
  return data;
};

export const getDoctors = async () => {
  const { data } = await api.get('/doctors');
  return data;
};

export const getPatients = async () => {
  const { data } = await api.get('/patients');
  return data;
};

export const getCallLogs = async () => {
  const { data } = await api.get('/calls');
  return data;
};

export const getAppointments = async () => {
  const { data } = await api.get('/appointments');
  return data;
};

export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const getKnowledgeDocs = async () => {
  const { data } = await api.get('/knowledge');
  return data;
};

export const getPrompts = async () => {
  const { data } = await api.get('/prompts');
  return data;
};

// Login method
export const login = async (credentials: any) => {
  // Use URLSearchParams for form-urlencoded required by OAuth2PasswordRequestForm
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);
  
  const { data } = await api.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return data;
};
