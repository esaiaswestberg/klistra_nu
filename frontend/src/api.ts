import type { components } from './api-types';

export const API_BASE = '/api';

export type Paste = components['schemas']['Paste'];
export type CreatePasteRequest = components['schemas']['CreatePasteRequest'];
export type GetPasteRequest = components['schemas']['GetPasteRequest'];

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
     throw new Error(`API Error: ${response.status}`);
  }

  // Handle text/plain response for createPaste
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text() as unknown as T;
  }
}
