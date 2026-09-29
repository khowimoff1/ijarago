import { loadSession } from './session.js';

const BASE = '/api';

async function request(path, options = {}) {
  const { token } = loadSession();
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && token) window.dispatchEvent(new Event('ijarago:unauthorized'));
  if (!res.ok) throw new Error(data.message || 'Xatolik yuz berdi');
  return data;
}

const send = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  stats: () => request('/stats'),
  categories: () => request('/categories'),
  districts: () => request('/districts'),
  listings: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
    return request('/listings?' + qs.toString());
  },
  listing: (id) => request('/listings/' + id),
  createListing: (body) => request('/listings', send('POST', body)),
  deleteListing: (id) => request('/listings/' + id, { method: 'DELETE' }),

  telegramAuth: (body) => request('/auth/telegram', send('POST', body)),

  me: () => request('/me'),
  updateMe: (body) => request('/me', send('PATCH', body)),
  myListings: () => request('/me/listings'),
  myBookings: () => request('/me/bookings'),
  myRequests: () => request('/me/requests'),
  userProfile: (id) => request('/users/' + id),

  createBooking: (body) => request('/bookings', send('POST', body)),
  updateBooking: (id, status) => request('/bookings/' + id, send('PATCH', { status })),
};
