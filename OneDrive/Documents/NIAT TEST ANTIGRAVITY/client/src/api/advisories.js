import { apiFetch } from './client.js';

export function createAdvisory(payload, imageFile = null) {
  const formData = new FormData();
  formData.append('payload', JSON.stringify(payload));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  return apiFetch('/advisories', {
    method: 'POST',
    body: formData,
  });
}

export function getAdvisories({ type, q, page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (q) params.append('q', q);
  params.append('page', page);
  params.append('pageSize', pageSize);

  return apiFetch(`/advisories?${params.toString()}`);
}

export function getAdvisory(id) {
  return apiFetch(`/advisories/${id}`);
}

export function deleteAdvisory(id) {
  return apiFetch(`/advisories/${id}`, {
    method: 'DELETE',
  });
}

export function getAdvisoryMessages(id) {
  return apiFetch(`/advisories/${id}/messages`);
}

export function sendAdvisoryChatMessage(id, message) {
  return apiFetch(`/advisories/${id}/chat`, {
    method: 'POST',
    body: { message },
  });
}

export function submitAdvisoryFeedback(id, rating, comment) {
  return apiFetch(`/advisories/${id}/feedback`, {
    method: 'PUT',
    body: { rating, comment },
  });
}
