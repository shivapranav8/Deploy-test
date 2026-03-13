// In production on Catalyst, the backend function lives at /server/node-server.
// In local dev, Vite proxies /api → localhost:5001 so no prefix is needed.
const API_BASE = (import.meta.env.VITE_API_BASE as string) || '';

export function apiFetch(path: string, options?: RequestInit): Promise<Response> {
    return fetch(`${API_BASE}${path}`, options);
}
