const API_BASE_URL = '/api';

/**
 * Helper function to make API requests with the JWT token automatically attached
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Get token from localStorage
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('admin_token');
  }

  // Set up headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  // If unauthorized (token expired/invalid), we could force a logout here
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    // We don't auto-redirect here to avoid infinite loops, 
    // the useAuth hook will handle the redirect.
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
