import { supabase } from '../lib/supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  constructor(code, message, status, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function apiFetch(endpoint, options = {}) {
  const { session } = (await supabase.auth.getSession()).data;
  const token = session?.access_token;

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set JSON content-type if body is an object and not FormData
  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || (payload && payload.success === false)) {
    const errorObj = payload?.error || {};
    throw new ApiError(
      errorObj.code || 'API_ERROR',
      errorObj.message || `Request failed with status ${response.status}`,
      response.status,
      errorObj.details || null
    );
  }

  return payload.data;
}
