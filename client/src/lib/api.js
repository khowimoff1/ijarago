const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Xatolik yuz berdi');
  return data;
}

export const api = {
  stats: () => request('/stats'),
  categories: () => request('/categories'),
  districts: () => request('/districts'),
  listings: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    return request('/listings?' + qs.toString());
  },
  listing: (id) => request('/listings/' + id),
  createListing: (body) => request('/listings', { method: 'POST', body: JSON.stringify(body) }),
  sendCode: (phone) => request('/auth/send-code', { method: 'POST', body: JSON.stringify({ phone }) }),
  verify: (body) => request('/auth/verify', { method: 'POST', body: JSON.stringify(body) }),
};
