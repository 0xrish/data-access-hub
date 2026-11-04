import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import { read, utils } from "xlsx";
import { importInitiatives } from "@/functions/savings";
import { DATA_COLUMNS } from "@/lib/data-columns";
import { useMyRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { title: "Upload Data — Supply Chain Control Center" },
      {
        name: "description",
        content: "Upload a new savings initiatives workbook to replace the current dataset.",
      },
      { property: "og:title", content: "Upload Data — Supply Chain Control Center" },
      {
        property: "og:description",
        content: "Admin data upload for savings initiatives.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

const KNOWN_COLUMNS = new Set(DATA_COLUMNS.map((c) => c.column));

interface ParsedData {
  fileName: string;
  sheetName: string;
  headers: string[];
  matchedColumns: number;
  uniqueIds: number;
  duplicateIds: number;
  totalColumns: number;
  rows: Record<string, unknown>[];
  preview: Record<string, unknown>[];
}

function normalizeHeader(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function UploadPage() {
  const { data: role, isLoading: roleLoading } = useMyRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const importFn = useServerFn(importInitiatives);

  const mutation = useMutation({
    mutationFn: (rows: Record<string, unknown>[]) => importFn({ data: { rows } }),
    onSuccess: async (result) => {
      toast.success(`Saved ${result.imported} records`, {
        description: `${result.newIds} new IDs · ${result.matchedIds} existing IDs kept as new and old versions · ${result.priorVersionsMarkedOld} previous rows retained.`,
      });
      await queryClient.invalidateQueries({ queryKey: ["initiatives"] });
      setParsed(null);
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Import failed");
    },
  });

  const processFile = useCallback(async (file: File) => {
    setParseError(null);
    setParsed(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["xlsx", "xls", "csv"].includes(ext)) {
      setParseError("Please upload an .xlsx, .xls, or .csv file.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const wb = read(buffer, { type: "array", cellDates: true });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) {
        setParseError("The workbook has no sheets.");
        return;
      }
      const sheet = wb.Sheets[sheetName];
      if (!sheet) {
        setParseError("The first worksheet could not be read.");
        return;
      }
      const rawRows = utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: null,
      });
      if (rawRows.length === 0) {
        setParseError("The sheet is empty — no data rows found.");
        return;
      }

      // Map headers to normalised db column names
      const firstRow = rawRows[0];
      if (!firstRow) {
        setParseError("The sheet is empty — no data rows found.");
        return;
      }
      const originalHeaders = Object.keys(firstRow);
      const headerMap = new Map<string, string>();
      for (const h of originalHeaders) {
        const norm = normalizeHeader(h);
        if (KNOWN_COLUMNS.has(norm)) headerMap.set(h, norm);
      }

      const rows = rawRows.map((raw) => {
        const out: Record<string, unknown> = {};
        for (const [origKey, dbCol] of headerMap) {
          out[dbCol] = raw[origKey];
        }
        return out;
      });

      const ids = rows.map((row) => String(row["mat_plant"] ?? "").trim());
      const missingIds = ids.filter((id) => !id).length;
      if (missingIds > 0) {
        setParseError(`${missingIds} row${missingIds === 1 ? " is" : "s are"} missing a Mat+Plant unique ID.`);
        return;
      }
      const uniqueIds = new Set(ids).size;

      setParsed({
        fileName: file.name,
        sheetName,
        headers: [...headerMap.values()],
        matchedColumns: headerMap.size,
        uniqueIds,
        duplicateIds: rows.length - uniqueIds,
        totalColumns: originalHeaders.length,
        rows,
        preview: rows.slice(0, 5),
      });
    } catch {
      setParseError("Failed to parse the file. Make sure it is a valid Excel or CSV workbook.");
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
        <AlertTriangle className="size-10 text-destructive" />
        <h2 className="font-display text-lg font-semibold text-foreground">Access Denied</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Only administrators can upload data. Contact your admin to request access.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Upload Savings Data
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload an Excel (.xlsx / .xls) or CSV file. Records append by their Mat+Plant unique ID;
          existing versions stay in the registry and are marked Old when an updated version arrives.
        </p>
      </div>

      {/* Drop zone */}
      <Card
        className={`relative cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-dashed"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center gap-3 py-14">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop your file here or <span className="text-primary underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports .xlsx, .xls, and .csv — max 5,000 rows
            </p>
          </div>
        </CardContent>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="sr-only"
          onChange={handleFileInput}
        />
      </Card>

      {/* Parse error */}
      {parseError && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Unable to process file</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{parseError}</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {parsed && (
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="size-5 text-primary" />
              <div>
                <CardTitle className="font-display text-sm font-semibold text-foreground">
                  {parsed.fileName}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Sheet "{parsed.sheetName}" · {parsed.rows.length} row
                  {parsed.rows.length === 1 ? "" : "s"} · {parsed.matchedColumns} of{" "}
                  {parsed.totalColumns} columns matched
                </p>
                <p className="text-xs text-muted-foreground">
                  Mat+Plant IDs: {parsed.uniqueIds} unique · {parsed.duplicateIds} repeated in this upload
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                e.stopPropagation();
                setParsed(null);
              }}
            >
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {parsed.matchedColumns < 5 && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/50 bg-amber-50 p-3 dark:bg-amber-950/30">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Only {parsed.matchedColumns} columns matched the expected schema. Double-check
                  your file headers match the expected column names.
                </p>
              </div>
            )}

            {/* Preview table */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Preview (first {parsed.preview.length} rows)
              </p>
              <div className="max-h-64 overflow-auto rounded-md border border-border">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      {parsed.headers.slice(0, 10).map((h) => (
                        <TableHead key={h} className="whitespace-nowrap text-[11px]">
                          {h}
                        </TableHead>
                      ))}
                      {parsed.headers.length > 10 && (
                        <TableHead className="text-[11px]">
                          +{parsed.headers.length - 10} more
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsed.preview.map((row, i) => (
                      <TableRow key={i}>
                        {parsed.headers.slice(0, 10).map((h) => (
                          <TableCell
                            key={h}
                            className="max-w-40 truncate whitespace-nowrap text-xs"
                          >
                            {row[h] == null ? "—" : String(row[h])}
                          </TableCell>
                        ))}
                        {parsed.headers.length > 10 && (
                          <TableCell className="text-xs text-muted-foreground">…</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParsed(null)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate(parsed.rows)}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Importing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" /> Save {parsed.rows.length} rows
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
