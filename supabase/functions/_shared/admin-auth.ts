import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export type AdminAuthResult =
  | { ok: true; userId: string; email: string | null; supabase: ReturnType<typeof createClient> }
  | { ok: false; status: number; error: string };

/**
 * Verifies the request comes from an authenticated user with the 'admin' role.
 * Returns { ok: true, userId, email, supabase } on success, or { ok: false, status, error } on failure.
 */
export async function requireAdmin(req: Request): Promise<AdminAuthResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey =
    Deno.env.get("SUPABASE_ANON_KEY") ||
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ||
    "";
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }
  const user = userData.user;

  const { data: roleData, error: roleErr } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  if (roleErr || !roleData) {
    return { ok: false, status: 403, error: "Admin role required" };
  }

  return { ok: true, userId: user.id, email: user.email ?? null, supabase };
}
