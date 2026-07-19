/// <reference types="vite/client" />

// Base URL configuration for the API
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function resolveApiUrl(path: string) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanEndpoint = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanEndpoint}`;
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let url = '';
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    url = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    url = `${BASE_URL}${cleanEndpoint}`;
  }

  const headers = new Headers(options.headers || {});

  // Inject content-type automatically if JSON body is sent
  if (options.body && typeof options.body === 'string' && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
