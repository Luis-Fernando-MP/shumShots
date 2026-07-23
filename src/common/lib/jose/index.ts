import { EncryptJWT, jwtDecrypt } from 'jose';

interface SealOptions {
  exp?: string;
  subject?: string;
  secret: string;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const encoded = new TextEncoder().encode(secret);
  const keyBytes = new Uint8Array(32);
  keyBytes.set(encoded.slice(0, 32));

  return crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ]);
}

async function seal(payload: Record<string, unknown>, options: SealOptions): Promise<string> {
  const { exp = '1h', secret, subject } = options;
  const key = await getKey(secret);

  const jwt = new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(exp);

  if (subject) jwt.setSubject(subject);

  const token = await jwt.encrypt(key);
  return token;
}

async function unseal<T = Record<string, unknown>>(encrypted: string, secret: string): Promise<T> {
  const key = await getKey(secret);
  const { payload } = await jwtDecrypt(encrypted, key);
  return payload as T;
}

export { seal, unseal };
export type { SealOptions };
