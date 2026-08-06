/* =========================================================
   SkillSwap — api.js
   A tiny shared helper that talks to the backend API.
   Loaded BEFORE script.js on every page that needs it.
   ========================================================= */
(function () {
  // Where the backend runs. Change this if you deploy the API elsewhere.
  const API_BASE = 'http://localhost:4000/api';

  // ---- Token storage (keeps the user logged in across pages) ----
  const TOKEN_KEY = 'skillswap-token';
  const USER_KEY = 'skillswap-user';

  const auth = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => {
      try { return JSON.parse(localStorage.getItem(USER_KEY)); }
      catch { return null; }
    },
    save: (token, user) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clear: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  };

  // ---- Core request function ----
  // Automatically adds JSON headers and the auth token, and throws a
  // readable Error (err.message) when the server returns an error.
  async function request(path, { method = 'GET', body, authRequired = false } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (authRequired) {
      const token = auth.getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    let res;
    try {
      res = await fetch(API_BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new Error('Could not reach the server. Is the backend running?');
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong.');
    }
    return data;
  }

  // ---- Public API, grouped by feature ----
  const API = {
    auth,

    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),

    register: (name, email, password) =>
      request('/auth/register', { method: 'POST', body: { name, email, password } }),

    me: () => request('/auth/me', { authRequired: true }),

    listSkills: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('/skills' + (qs ? `?${qs}` : ''));
    },
    getSkill: (id) => request(`/skills/${id}`),
    createSkill: (data) => request('/skills', { method: 'POST', body: data, authRequired: true }),

    createExchange: (data) =>
      request('/exchanges', { method: 'POST', body: data, authRequired: true }),

    listMessages: () => request('/messages', { authRequired: true }),
    getThread: (userId) => request(`/messages/${userId}`, { authRequired: true }),
    sendMessage: (receiverId, body) =>
      request('/messages', { method: 'POST', body: { receiverId, body }, authRequired: true }),

    sendContact: (data) => request('/contact', { method: 'POST', body: data }),
  };

  // Expose globally so script.js (and any page) can use `window.SkillSwapAPI`.
  window.SkillSwapAPI = API;
})();
