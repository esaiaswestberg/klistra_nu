import type { components } from './api-types';

export const API_BASE = '/api';

export type Paste = components['schemas']['Paste'];
export type CreatePasteRequest = components['schemas']['CreatePasteRequest'];
export type FileSchema = components['schemas']['File'];

export async function createPaste(data: CreatePasteRequest): Promise<Paste> {
  const response = await fetch(`${API_BASE}/pastes`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
     throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function getPaste(id: string, password?: string): Promise<Paste> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (password) {
    headers['X-Paste-Password'] = password;
  }

  const response = await fetch(`${API_BASE}/pastes/${id}`, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
     if (response.status === 401) throw new Error("Unauthorized");
     if (response.status === 404) throw new Error("NotFound");
     throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function getLastPasteSession(): Promise<string> {
   const response = await fetch(`${API_BASE}/session/last-paste`);
   if (!response.ok) return "";
   const data = await response.json();
   return data.id || "";
}