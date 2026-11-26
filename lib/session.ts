import { connection } from "next/server";

// Signed login cookie. Uses Web Crypto so it works in middleware and server actions.
export const SESSION_COOKIE = "shop_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

async function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function createSessionToken(): Promise<string | null> {
  await connection();
  const key = await getKey();
  if (!key) return null;
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(expires));
  const hex = Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${expires}.${hex}`;
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const match = token.match(/^(\d+)\.([0-9a-f]{64})$/);
  if (!match) return false;

  // Next.js 16: Halt prerendering and wait for user request connection before evaluating Date.now()
  await connection();

  if (Number(match[1]) < Date.now()) return false;
  const key = await getKey();
  if (!key) return false;
  const signature = Uint8Array.from(match[2].match(/../g)!, (pair) => parseInt(pair, 16));
  return crypto.subtle.verify("HMAC", key, signature, encoder.encode(match[1]));
}
