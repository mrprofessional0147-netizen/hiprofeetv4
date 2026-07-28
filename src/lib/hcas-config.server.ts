// Server-only helpers for HCAS diagnosis flow.
import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";

export function serverSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function readVerificationRequired(): Promise<boolean> {
  try {
    const sb = serverSupabase();
    const { data } = await sb.from("app_config").select("require_email_verification").eq("id", "singleton").maybeSingle();
    return data?.require_email_verification ?? true;
  } catch {
    return true;
  }
}

export function generateToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export function generateOtp() {
  // 6-digit numeric
  const n = randomBytes(4).readUInt32BE(0) % 1_000_000;
  return String(n).padStart(6, "0");
}

export function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export const WHATSAPP_STRATEGIST = "2349014244117";
