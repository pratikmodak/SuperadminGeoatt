// superadmin-web/src/api/client.js
const API_URL = import.meta.env.VITE_API_URL || 'https://api.geoattend.in';

let accessToken = localStorage.getItem('ga_token') || null;

export const setToken = (t) => {
  accessToken = t;
  if (t) localStorage.setItem('ga_token', t);
  else localStorage.removeItem('ga_token');
};

export const request = async (method, path, body = null) => {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    setToken(null);
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  get:    (path)       => request('GET', path),
  post:   (path, body) => request('POST', path, body),
  patch:  (path, body) => request('PATCH', path, body),
  delete: (path)       => request('DELETE', path),
};

// ── Typed API calls ────────────────────────────────────────
export const superadminAPI = {
  dashboard:  () => api.get('/api/superadmin/dashboard'),
  companies:  () => api.get('/api/companies'),
  createCompany: (d) => api.post('/api/companies', d),
  attendance: (p={}) => api.get(`/api/attendance?${new URLSearchParams(p)}`),
  leaves:     (p={}) => api.get(`/api/leaves?${new URLSearchParams(p)}`),
  approveLeave:(id,s,r)=>api.patch(`/api/leaves/${id}`, {status:s,rejection_reason:r}),
  geofences:  () => api.get('/api/geofences'),
  createGeo:  (d) => api.post('/api/geofences', d),
  audit:      (p={}) => api.get(`/api/audit?${new URLSearchParams(p)}`),
  credits:    () => api.get('/api/credits'),
  topup:      (id,n) => api.post(`/api/credits/${id}/topup`, {amount:n}),
  payroll:    (p={}) => api.get(`/api/payroll?${new URLSearchParams(p)}`),
};
