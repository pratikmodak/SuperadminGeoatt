const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getToken   = ()  => localStorage.getItem('ga_token');
export const getUser    = ()  => { try { return JSON.parse(localStorage.getItem('ga_user')||'null'); } catch { return null; } };
export const setAuth    = (token, refresh, user) => {
  localStorage.setItem('ga_token',   token);
  localStorage.setItem('ga_refresh', refresh);
  localStorage.setItem('ga_user',    JSON.stringify(user));
};
export const clearAuth  = ()  => ['ga_token','ga_refresh','ga_user'].forEach(k => localStorage.removeItem(k));
export const isLoggedIn = ()  => !!getToken();

const tryRefresh = async () => {
  const rt = localStorage.getItem('ga_refresh');
  if (!rt) return false;
  try {
    const r = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    });
    if (!r.ok) return false;
    const d = await r.json();
    localStorage.setItem('ga_token',   d.token);
    localStorage.setItem('ga_refresh', d.refresh_token);
    return true;
  } catch { return false; }
};

export const request = async (method, path, body = null, retry = true) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    const ok = await tryRefresh();
    if (ok) return request(method, path, body, false);
    clearAuth(); window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
};

const api = {
  get:    (p)    => request('GET',    p),
  post:   (p, b) => request('POST',   p, b),
  patch:  (p, b) => request('PATCH',  p, b),
  delete: (p)    => request('DELETE', p),
};

export const authAPI = {
  login:  (email, password) => api.post('/api/auth/login', { email, password }),
  logout: ()                => api.post('/api/auth/logout'),
  me:     ()                => api.get('/api/auth/me'),
};

export const superadminAPI = {
  dashboard: ()         => api.get('/api/superadmin/dashboard'),
  stats:     ()         => api.get('/api/superadmin/stats'),
  audit:     (p={})     => api.get(`/api/superadmin/audit?${new URLSearchParams(p)}`),
  updateCredits:(id, d) => api.patch(`/api/superadmin/companies/${id}/credits`, d),
  announce:  (d)        => api.post('/api/superadmin/announce', d),
};

export const companiesAPI = {
  list:   ()      => api.get('/api/companies'),
  create: (d)     => api.post('/api/companies', d),
  update: (id, d) => api.patch(`/api/companies/${id}`, d),
};

export const employeesAPI = {
  list:   (p={})  => api.get(`/api/employees?${new URLSearchParams(p)}`),
  create: (d)     => api.post('/api/employees', d),
  update: (id, d) => api.patch(`/api/employees/${id}`, d),
};

export const geofencesAPI = {
  list:   (p={})  => api.get(`/api/geofences?${new URLSearchParams(p)}`),
  create: (d)     => api.post('/api/geofences', d),
  update: (id, d) => api.patch(`/api/geofences/${id}`, d),
  delete: (id)    => api.delete(`/api/geofences/${id}`),
};

export const attendanceAPI = {
  today:   (p={}) => api.get(`/api/attendance/today?${new URLSearchParams(p)}`),
  history: (p={}) => api.get(`/api/attendance/history?${new URLSearchParams(p)}`),
  regulariseList:   (p={}) => api.get(`/api/attendance/regularise?${new URLSearchParams(p)}`),
  regulariseAction: (id,d) => api.patch(`/api/attendance/regularise/${id}`, d),
};

export const leavesAPI = {
  list:    (p={}) => api.get(`/api/leaves?${new URLSearchParams(p)}`),
  approve: (id,d) => api.patch(`/api/leaves/${id}`, d),
};

export const auditAPI = {
  list: (p={}) => api.get(`/api/audit?${new URLSearchParams(p)}`),
};

export const reportsAPI = {
  downloadAttendance: (p) => window.open(`${API_URL}/api/reports/attendance?${new URLSearchParams({...p, token: getToken()})}`),
  downloadPayroll:    (p) => window.open(`${API_URL}/api/payroll/export?${new URLSearchParams({...p, token: getToken()})}`),
  summary: (p={}) => api.get(`/api/reports/summary?${new URLSearchParams(p)}`),
};

export default api;
