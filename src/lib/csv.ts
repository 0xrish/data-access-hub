import { DATA_COLUMNS, COLUMN_MAP } from "./data-columns";
import type { InitiativeRow } from "@/server/savings";

export function toCsv(rows: InitiativeRow[], columns: string[]): string {
  const cols = columns.filter((c) => COLUMN_MAP.has(c));
  const escape = (v: string | number | null | undefined) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map((c) => COLUMN_MAP.get(c)!.label).map(escape);
  const lines = rows.map((row) => cols.map((c) => escape(row[c])).join(","));
  return [header.join(","), ...lines].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
