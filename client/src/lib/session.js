const KEY = 'ijarago:session';

export const loadSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || { user: null, token: null }; } catch { return { user: null, token: null }; }
};

export const saveSession = (session) => {
  try { localStorage.setItem(KEY, JSON.stringify(session)); } catch { /* e'tiborsiz */ }
};

export const clearSession = () => {
  try { localStorage.removeItem(KEY); } catch { /* e'tiborsiz */ }
};
