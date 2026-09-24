import { createContext, useContext, useEffect, useState } from 'react';

const FavContext = createContext(null);
const KEY = 'ijarago:favorites';

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch { /* e'tiborsiz */ }
  }, [ids]);

  const toggle = (id) => setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const has = (id) => ids.includes(id);

  return <FavContext.Provider value={{ ids, toggle, has }}>{children}</FavContext.Provider>;
}

export const useFavorites = () => useContext(FavContext);
