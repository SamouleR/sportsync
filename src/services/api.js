const API_URL = 'http://localhost:3001/api';

// =============================================
// ============ HTTP HELPERS ===================
// =============================================

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

const getHeaders = () => {
  const session = sessionStorage.getItem('sportsync_session');
  let headers = { 'Content-Type': 'application/json' };
  if (session) {
    const { token } = JSON.parse(session);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const get = async (path) => {
  const response = await fetch(`${API_URL}${path}`, { headers: getHeaders() });
  return handleResponse(response);
};

const post = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(body),
  });
  return handleResponse(response);
};

const put = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT', headers: getHeaders(), body: JSON.stringify(body),
  });
  return handleResponse(response);
};

const del = async (path) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'DELETE', headers: getHeaders(),
  });
  return handleResponse(response);
};

// =============================================
// ============ AUTH SERVICE ====================
// =============================================
export const authService = {
  login: (email, password) => post('/auth/login', { email, password }),
};

// =============================================
// ============ USER SERVICE ====================
// =============================================
export const userService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/users${qs ? '?' + qs : ''}`);
  },
  getById: (id) => get(`/users/${id}`),
  create: (data) => post('/users', data),
  update: (id, data) => put(`/users/${id}`, data),
  delete: (id) => del(`/users/${id}`),
};

// =============================================
// ============ TRAINING SERVICE ================
// =============================================
export const trainingService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/trainings${qs ? '?' + qs : ''}`);
  },
  create: (data) => post('/trainings', data),
  delete: (id) => del(`/trainings/${id}`),
  getResponses: (id) => get(`/trainings/${id}/responses`),
  setResponse: (id, data) => post(`/trainings/${id}/responses`, data),
  getMessages: (id) => get(`/trainings/${id}/messages`),
  sendMessage: (id, data) => post(`/trainings/${id}/messages`, data),
};

// =============================================
// ============ MATCH SERVICE ===================
// =============================================
export const matchService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/matches${qs ? '?' + qs : ''}`);
  },
  getById: (id) => get(`/matches/${id}`),
  create: (data) => post('/matches', data),
  update: (id, data) => put(`/matches/${id}`, data),
  delete: (id) => del(`/matches/${id}`),
  updateConvocations: (id, data) => put(`/matches/${id}/convocations`, data),
  updateLineup: (id, data) => put(`/matches/${id}/lineup`, data),
  setResponse: (id, data) => post(`/matches/${id}/responses`, data),
};

// =============================================
// ============ EVENT SERVICE (LEGACY) ==========
// =============================================
export const eventService = {
  getAll: () => get('/events'),
  updateMatchLiveState: (id, liveState) => put(`/events/${id}/live`, { liveState }),
  closeMatch: (id) => post(`/events/${id}/close`),
};

// =============================================
// ============ STATS SERVICE ===================
// =============================================
export const statsService = {
  updateUserStats: (userId, data) => put(`/stats/${userId}`, data),
};

// =============================================
// ============ MEDICAL SERVICE =================
// =============================================
export const medicalService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return get(`/medical${qs ? '?' + qs : ''}`);
  },
  create: (data) => post('/medical', data),
  update: (id, data) => put(`/medical/${id}`, data),
};

// =============================================
// ============ NOTIFICATION SERVICE ============
// =============================================
export const notificationService = {
  getAll: (userId) => get(`/notifications/${userId}`),
  markRead: (id) => put(`/notifications/${id}/read`),
  markAllRead: (userId) => put(`/notifications/user/${userId}/read-all`),
  create: (data) => post('/notifications', data),
};
