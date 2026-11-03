import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DATA_COLUMNS } from "@/lib/data-columns";

export type InitiativeRow = Record<string, string | number | null> & { id: string };

const ALLOWED_COLUMNS = new Set(DATA_COLUMNS.map((c) => c.column));
const DATE_COLUMNS = new Set(DATA_COLUMNS.filter((c) => c.type === "date").map((c) => c.column));
const NUMERIC_COLUMNS = new Set(DATA_COLUMNS.filter((c) => c.type === "number").map((c) => c.column));

export const getInitiatives = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<InitiativeRow[]> => {
    const { data, error } = await context.supabase
      .from("savings_initiatives")
      .select("*")
      .order("material_name", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as InitiativeRow[];
  });

interface ImportInput {
  rows: Record<string, unknown>[];
}

function coerceValue(column: string, value: unknown): string | number | null {
  if (value == null || value === "") return null;
  if (NUMERIC_COLUMNS.has(column)) {
    const n = typeof value === "number" ? value : Number(String(value).replace(/[,$\s]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  if (DATE_COLUMNS.has(column)) {
    const d = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }
  return String(value).trim() || null;
}

export const importInitiatives = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const parsed = input as ImportInput;
    if (!parsed || !Array.isArray(parsed.rows)) {
      throw new Error("Invalid upload payload");
    }
    return parsed;
  })
  .handler(async ({ context, data }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Only admins can upload data");

    const clean = data.rows.slice(0, 5000).map((row) => {
      const out: Record<string, string | number | null> = {};
      for (const [key, value] of Object.entries(row)) {
        if (ALLOWED_COLUMNS.has(key)) out[key] = coerceValue(key, value);
      }
      return out;
    });

    // Load the service-role client lazily, inside the verified-admin handler.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const del = await supabaseAdmin
      .from("savings_initiatives")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (del.error) throw new Error(del.error.message);

    type InsertRow = import("@/integrations/supabase/types").Database["public"]["Tables"]["savings_initiatives"]["Insert"];
    const payload = clean as unknown as InsertRow[];

    const CHUNK = 200;
    for (let i = 0; i < payload.length; i += CHUNK) {
      const { error } = await supabaseAdmin.from("savings_initiatives").insert(payload.slice(i, i + CHUNK));
      if (error) throw new Error(error.message);
    }
    return { imported: payload.length };
  });
