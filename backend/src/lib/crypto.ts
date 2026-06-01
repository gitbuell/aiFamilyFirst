// PHI cryptography — built on Node's `crypto` only (no native deps, builds on alpine).
//  - Passwords: scrypt with per-user random salt (HIPAA access control).
//  - PHI fields: AES-256-GCM authenticated encryption at rest (§164.312(a)(2)(iv)).
import crypto from 'crypto';

// ---------- Password hashing (scrypt) ----------
const SCRYPT_N = 16384, SCRYPT_R = 8, SCRYPT_P = 1, KEYLEN = 64;

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(plain, salt, KEYLEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  // format: scrypt$N$r$p$saltB64$hashB64
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(hashB64, 'base64');
  const actual = crypto.scryptSync(plain, salt, expected.length, { N: +n, r: +r, p: +p });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

// ---------- Field-level PHI encryption (AES-256-GCM) ----------
function masterKey(): Buffer {
  const b64 = process.env.MASTER_ENCRYPTION_KEY || '';
  const key = Buffer.from(b64, 'base64');
  if (key.length !== 32) {
    throw new Error('MASTER_ENCRYPTION_KEY must be 32 bytes (base64). Generate with: npm run genkey');
  }
  return key;
}

// Returns base64(iv[12] || authTag[16] || ciphertext)
export function encryptPHI(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decryptPHI(packed: string): string {
  const buf = Buffer.from(packed, 'base64');
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

// ---------- Session tokens ----------
// Raw token goes to the client once; only its sha256 hash is stored server-side.
export function newSessionToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, tokenHash: sha256(token) };
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
