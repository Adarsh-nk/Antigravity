import { apiFetch } from './client.js';

export function getDashboardSummary() {
  return apiFetch('/dashboard/summary');
}
