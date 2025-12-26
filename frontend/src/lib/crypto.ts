export async function encryptFile(file: File): Promise<{ encryptedBlob: Blob; keyBase64: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    arrayBuffer
  );

  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

  return {
    encryptedBlob: new Blob([combined]),
    keyBase64
  };
}

export async function decryptFile(blob: Blob, keyBase64: string): Promise<Blob> {
  const combined = await blob.arrayBuffer();
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  const keyBuffer = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    'AES-GCM',
    true,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    ciphertext
  );

  return new Blob([decrypted]);
}
