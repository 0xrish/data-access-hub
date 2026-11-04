import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DATA_COLUMNS } from "@/lib/data-columns";

export type InitiativeRecordStatus = "new" | "old";
export type InitiativeRow = Record<string, string | number | null> & {
  id: string;
  mat_plant: string | null;
  record_status: InitiativeRecordStatus;
  imported_at: string;
};

const ALLOWED_COLUMNS = new Set(DATA_COLUMNS.map((c) => c.column));
const DATE_COLUMNS = new Set(DATA_COLUMNS.filter((c) => c.type === "date").map((c) => c.column));
const NUMERIC_COLUMNS = new Set(
  DATA_COLUMNS.filter((c) => c.type === "number").map((c) => c.column),
);

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

export interface ImportResult {
  imported: number;
  newIds: number;
  matchedIds: number;
  duplicateRowsInUpload: number;
  priorVersionsMarkedOld: number;
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
  .validator((input: unknown) => {
    const parsed = input as ImportInput;
    if (!parsed || !Array.isArray(parsed.rows) || parsed.rows.length === 0) {
      throw new Error("Invalid upload payload");
    }
    if (parsed.rows.length > 5000) throw new Error("Uploads are limited to 5,000 rows");
    if (parsed.rows.some((row) => !row || typeof row !== "object" || Array.isArray(row))) {
      throw new Error("Each uploaded row must be a record");
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

    const clean = data.rows.map((row, index) => {
      const out: Record<string, string | number | null> = {};
      for (const [key, value] of Object.entries(row)) {
        if (ALLOWED_COLUMNS.has(key)) out[key] = coerceValue(key, value);
      }
      const id = String(out["mat_plant"] ?? "").trim();
      if (!id) throw new Error(`Row ${index + 2} is missing its Mat+Plant ID`);
      out["mat_plant"] = id;
      return out;
    });

    // Use the server-only PostgreSQL connection after verifying the admin role.
    const { getDatabase } = await import("@/integrations/supabase/db.server");
    const db = getDatabase();
    const inputIdCounts = new Map<string, number>();
    const lastIndexById = new Map<string, number>();
    clean.forEach((row, index) => {
      const id = String(row["mat_plant"]);
      inputIdCounts.set(id, (inputIdCounts.get(id) ?? 0) + 1);
      lastIndexById.set(id, index);
    });
    const ids = [...inputIdCounts.keys()];
    const columns = DATA_COLUMNS.map((column) => column.column).filter((column) =>
      clean.some((row) => Object.hasOwn(row, column)),
    );
    const identifiers = columns.map((column) => `"${column}"`).join(", ");
    const rowsToInsert: Record<string, string | number | null>[] = clean.map((row, index) => ({
      ...row,
      record_status: lastIndexById.get(String(row["mat_plant"])) === index ? "new" : "old",
    }));

    const stats = await db.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtext('import-savings-initiatives'))`;
      const existing = await tx`
        select mat_plant from public.savings_initiatives
        where mat_plant = any(${ids})
        for update
      `;
      const existingIds = new Set(existing.map((row) => String(row["mat_plant"])));
      await tx`
        update public.savings_initiatives
        set record_status = 'old'
        where mat_plant = any(${ids})
      `;
      const insertColumns = [...columns, "record_status", "imported_at"];
      const quotedInsertColumns = insertColumns.map((column) => `"${column}"`).join(", ");
      const batchSize = 400;
      for (let start = 0; start < rowsToInsert.length; start += batchSize) {
        const batch = rowsToInsert.slice(start, start + batchSize);
        const values: (string | number | null)[] = [];
        const tuples = batch.map((row, rowIndex) => {
          const rowValues = [...columns.map((column) => row[column] ?? null), row["record_status"] ?? null];
          const offset = rowIndex * rowValues.length;
          values.push(...rowValues);
          return `(${rowValues.map((_, valueIndex) => `$${offset + valueIndex + 1}`).join(", ")}, now())`;
        });
        await tx.unsafe(
          `insert into public.savings_initiatives (${quotedInsertColumns}) values ${tuples.join(", ")}`,
          values,
        );
      }
      return {
        newIds: ids.filter((id) => !existingIds.has(id)).length,
        matchedIds: ids.filter((id) => existingIds.has(id)).length,
        priorVersionsMarkedOld: existing.length,
      };
    });
    return {
      imported: clean.length,
      ...stats,
      duplicateRowsInUpload: clean.length - ids.length,
    } satisfies ImportResult;
  });

export const removeInitiative = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => {
    const parsed = input as { id?: string };
    if (!parsed?.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.id)) {
      throw new Error("Invalid record id");
    }
    return { id: parsed.id };
  })
  .handler(async ({ context, data }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    if (!isAdmin) throw new Error("Only admins can remove data");

    const { getDatabase } = await import("@/integrations/supabase/db.server");
    const db = getDatabase();
    return db.begin(async (tx) => {
      await tx`select pg_advisory_xact_lock(hashtext('import-savings-initiatives'))`;
      const [record] = await tx`
        select mat_plant, record_status from public.savings_initiatives
        where id = ${data.id} for update
      `;
      if (!record) throw new Error("Record was not found");
      await tx`delete from public.savings_initiatives where id = ${data.id}`;
      if (record["record_status"] === "new" && record["mat_plant"]) {
        await tx`
          update public.savings_initiatives set record_status = 'new'
          where id = (
            select id from public.savings_initiatives
            where mat_plant = ${record["mat_plant"]}
            order by imported_at desc, created_at desc, id desc
            limit 1
          )
        `;
      }
      return { matPlant: String(record["mat_plant"] ?? "") };
    });
  });

