import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { serverEnv } from "./env";

const ALGO = "aes-256-gcm";

function key(): Buffer {
  const hex = serverEnv().ENCRYPTION_KEY;
  if (hex.length !== 64) throw new Error("ENCRYPTION_KEY must be 64 hex chars (32 bytes)");
  return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, encB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !encB64) throw new Error("malformed ciphertext");
  const decipher = createDecipheriv(ALGO, key(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const dec = Buffer.concat([decipher.update(Buffer.from(encB64, "base64url")), decipher.final()]);
  return dec.toString("utf8");
}
