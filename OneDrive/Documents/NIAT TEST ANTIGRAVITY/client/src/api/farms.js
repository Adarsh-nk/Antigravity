import { apiFetch } from './client.js';

export function getFarms() {
  return apiFetch('/farms');
}

export function getFarm(id) {
  return apiFetch(`/farms/${id}`);
}

export function createFarm(data) {
  return apiFetch('/farms', {
    method: 'POST',
    body: data,
  });
}

export function updateFarm(id, data) {
  return apiFetch(`/farms/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteFarm(id) {
  return apiFetch(`/farms/${id}`, {
    method: 'DELETE',
  });
}
