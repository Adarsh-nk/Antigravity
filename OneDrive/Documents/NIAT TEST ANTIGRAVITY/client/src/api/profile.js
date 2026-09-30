import { apiFetch } from './client.js';

export function getProfile() {
  return apiFetch('/profile');
}

export function updateProfile(data) {
  return apiFetch('/profile', {
    method: 'PUT',
    body: data,
  });
}

export function deleteAccount() {
  return apiFetch('/profile', {
    method: 'DELETE',
  });
}
