import { normalizeInboxPayload } from '../utils/inboxNormalizer';

const normalizeApiBase = (value = '') => {
  const base = String(value || '').trim();
  if (!base) return '';
  if (/^https?:\/\//i.test(base)) return base.replace(/\/+$/, '');
  return `https://${base.replace(/\/+$/, '')}`;
};

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE || 'admin-mail.soulmatrix.in');

const buildUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

const parseResponse = async (res) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function getInbox() {
  const res = await fetch(buildUrl('/mail/incoming'));
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to load inbox');
  return normalizeInboxPayload(payload);
}

export async function getSent() {
  const res = await fetch(buildUrl('/mail/sent'));
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to load sent mail');
  return normalizeInboxPayload(payload);
}

export async function getStarred() {
  const res = await fetch(buildUrl('/mail/starred'));
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to load starred mail');
  return normalizeInboxPayload(payload);
}

export async function getDeleted() {
  const res = await fetch(buildUrl('/mail/deleted'));
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to load trash');
  return normalizeInboxPayload(payload);
}

export async function getMail(id) {
  const res = await fetch(buildUrl(`/mail/${id}`));
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to load message');
  const normalized = normalizeInboxPayload(payload);
  return normalized[0] || null;
}

export async function sendMail({ from_email, to, subject, text, html }) {
  const res = await fetch(buildUrl('/send-email'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from_email, to, subject, text, html }),
  });
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to send message');
  return payload;
}

export async function markMailRead(id) {
  const res = await fetch(buildUrl(`/mail/${id}/read`), { method: 'POST' });
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to mark as read');
  return payload;
}

export async function toggleMailStar(id) {
  const res = await fetch(buildUrl(`/mail/${id}/star`), { method: 'POST' });
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to update star');
  return payload;
}

export async function deleteMail(id) {
  const res = await fetch(buildUrl(`/mail/${id}/delete`), { method: 'POST' });
  const payload = await parseResponse(res);
  if (!res.ok) throw new Error(typeof payload === 'string' ? payload : 'Unable to delete message');
  return payload;
}
