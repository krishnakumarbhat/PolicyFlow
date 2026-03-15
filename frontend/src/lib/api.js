const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_BACKEND_URL is required.');
}

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed for ${path}`);
  }

  return response.json();
};

export const fetchNodeCatalog = () => request('/node-catalog');
export const validateGraph = (payload) => request('/graphs/validate', { body: JSON.stringify(payload), method: 'POST' });
export const runGraph = (payload) => request('/run', { body: JSON.stringify(payload), method: 'POST' });
export const exportCode = (payload) => request('/export', { body: JSON.stringify(payload), method: 'POST' });

export const buildWebSocketUrl = (clientId) => {
  if (API_BASE_URL.startsWith('http')) {
    const url = new URL(API_BASE_URL);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = `${url.pathname.replace(/\/$/, '')}/ws/${clientId}`;
    return url.toString();
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${window.location.host}${API_BASE_URL.replace(/\/$/, '')}/ws/${clientId}`;
};