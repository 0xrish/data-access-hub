import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface ManagedUser {
  userId: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  role: "admin" | "viewer" | "pending" | null;
}

async function requireAdmin(context: {
  supabase: import("@supabase/supabase-js").SupabaseClient;
  userId: string;
}) {
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
    const { getDatabase } = await import("@/integrations/supabase/db.server");
    const db = getDatabase();
    const rows = await db`
      select u.id as "userId", coalesce(u.email, '(no email)') as email,
             u.created_at::text as "createdAt", u.last_sign_in_at::text as "lastSignInAt",
             r.role::text as role
      from auth.users u
      left join public.user_roles r on r.user_id = u.id
      order by u.created_at desc
      limit 1000
    `;
    return rows as unknown as ManagedUser[];
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => {
    const parsed = input as { userId?: string; role?: string };
    if (!parsed?.userId || !["admin", "viewer", "pending"].includes(parsed.role ?? "")) {
      throw new Error("Invalid role update");
    }
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.userId)) {
      throw new Error("Invalid user id");
    }
    return { userId: parsed.userId, role: parsed.role as "admin" | "viewer" | "pending" };
  })
  .handler(async ({ context, data }) => {
    await requireAdmin(context);
    const { getDatabase } = await import("@/integrations/supabase/db.server");
    const db = getDatabase();
    await db.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtext('manage-user-roles'))`;
      const [target] = await tx`select role::text as role from public.user_roles where user_id = ${data.userId} for update`;
      if (!target) throw new Error("User role was not found");
      if (target["role"] === "admin" && data.role !== "admin") {
        const [adminCount] = await tx`select count(*)::int as count from public.user_roles where role = 'admin'`;
        if (((adminCount?.["count"] as number | undefined) ?? 0) <= 1) {
          throw new Error("The last administrator cannot be removed");
        }
      }
      await tx`update public.user_roles set role = ${data.role}::public.app_role where user_id = ${data.userId}`;
    });
    return { ok: true };
  });

