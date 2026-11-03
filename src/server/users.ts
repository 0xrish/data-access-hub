import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ManagedUser {
  userId: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  role: "admin" | "viewer" | null;
}

async function requireAdmin(context: { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!isAdmin) throw new Error("Only admins can manage users");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ManagedUser[]> => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: users, error: usersError }, { data: roles, error: rolesError }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 500 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (usersError) throw new Error(usersError.message);
    if (rolesError) throw new Error(rolesError.message);

    const roleByUser = new Map((roles ?? []).map((r) => [r.user_id, r.role as "admin" | "viewer"]));
    return (users.users ?? []).map((u) => ({
      userId: u.id,
      email: u.email ?? "(no email)",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at ?? null,
      role: roleByUser.get(u.id) ?? null,
    }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const parsed = input as { userId?: string; role?: string };
    if (!parsed?.userId || (parsed.role !== "admin" && parsed.role !== "viewer")) {
      throw new Error("Invalid role update");
    }
    return { userId: parsed.userId, role: parsed.role as "admin" | "viewer" };
  })
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: delError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (delError) throw new Error(delError.message);

    if (data.role === "admin") {
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: "admin" });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
