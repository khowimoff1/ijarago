import { createContext, useContext, useEffect, useState } from 'react';
import { loadSession, saveSession, clearSession } from '../lib/session.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession().user);

  const login = ({ user: u, token }) => {
    setUser(u);
    saveSession({ user: u, token });
  };
  const logout = () => {
    setUser(null);
    clearSession();
  };
  const updateUser = (u) => {
    setUser(u);
    saveSession({ user: u, token: loadSession().token });
  };

  useEffect(() => {
    window.addEventListener('ijarago:unauthorized', logout);
    return () => window.removeEventListener('ijarago:unauthorized', logout);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
