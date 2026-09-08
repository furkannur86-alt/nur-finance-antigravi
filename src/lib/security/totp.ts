// Real RFC 6238 TOTP (Time-based One-Time Password), computed client-side via the
// browser's Web Crypto API — compatible with Google Authenticator / Authy / any
// standard authenticator app. No server round-trip; the secret never leaves the browser.

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;
const DIGITS = 6;

export function generateBase32Secret(byteLength = 20): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  let bits = "";
  for (const b of bytes) bits += b.toString(2).padStart(8, "0");
  let secret = "";
  for (let i = 0; i + 5 <= bits.length; i += 5) {
    secret += BASE32_ALPHABET[parseInt(bits.slice(i, i + 5), 2)];
  }
  return secret;
}

function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of clean) {
    const val = BASE32_ALPHABET.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

async function hmacSha1(keyBytes: Uint8Array, msgBytes: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", keyBytes as BufferSource, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, msgBytes as BufferSource);
  return new Uint8Array(sig);
}

function counterToBytes(counter: number): Uint8Array {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  // JS numbers are safe up to 2^53; counter (time step) fits comfortably in the low 32 bits for centuries.
  view.setUint32(4, counter, false);
  return new Uint8Array(buf);
}

async function totpAt(secret: string, timeStepIndex: number): Promise<string> {
  const keyBytes = base32ToBytes(secret);
  const hmac = await hmacSha1(keyBytes, counterToBytes(timeStepIndex));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) | ((hmac[offset + 1] & 0xff) << 16) | ((hmac[offset + 2] & 0xff) << 8) | (hmac[offset + 3] & 0xff);
  const code = (binCode % 10 ** DIGITS).toString().padStart(DIGITS, "0");
  return code;
}

export async function generateCurrentTOTP(secret: string): Promise<string> {
  return totpAt(secret, Math.floor(Date.now() / 1000 / STEP_SECONDS));
}

// Accepts the current step and one step of clock drift on either side, matching
// how real authenticator apps and verifiers behave.
export async function verifyTOTP(secret: string, token: string): Promise<boolean> {
  const clean = token.trim().replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return false;
  const currentStep = Math.floor(Date.now() / 1000 / STEP_SECONDS);
  for (const drift of [0, -1, 1]) {
    if ((await totpAt(secret, currentStep + drift)) === clean) return true;
  }
  return false;
}

export function generateOtpAuthUri(secret: string, accountLabel: string, issuer = "NurFinance"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountLabel)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&digits=${DIGITS}&period=${STEP_SECONDS}`;
}
