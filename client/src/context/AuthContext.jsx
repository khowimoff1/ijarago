import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const KEY = 'ijarago:user';

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const login = (u) => {
    setUser(u);
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* e'tiborsiz */ }
  };
  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(KEY); } catch { /* e'tiborsiz */ }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
