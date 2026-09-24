export const som = (n) => new Intl.NumberFormat('ru-RU').format(Math.round(n || 0)).replace(/,/g, ' ') + " so'm";

export const plural = (n, word) => `${n} ${word}`;

export const daysBetween = (from, to) => {
  if (!from || !to) return 0;
  const d = Math.round((new Date(to) - new Date(from)) / 864e5);
  return d > 0 ? d : 0;
};

export const today = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
