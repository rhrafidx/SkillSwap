const defaultBaseUrl = 'http://localhost:4000/api';

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('skillswap-token');
}

function setStoredToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem('skillswap-token', token);
  } else {
    window.localStorage.removeItem('skillswap-token');
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || defaultBaseUrl;
}

async function request(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function fetchHealth() {
  return request('/health');
}

export async function fetchSkills(query = '', category = '') {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (category) params.append('category', category);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return request(`/skills${suffix}`);
}

export async function fetchSkillById(id) {
  return request(`/skills/${id}`);
}

export async function loginUser(payload) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (result?.token) setStoredToken(result.token);
  return result;
}

export async function registerUser(payload) {
  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (result?.token) setStoredToken(result.token);
  return result;
}

export async function getCurrentUser() {
  return request('/auth/me');
}

export async function submitContact(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
