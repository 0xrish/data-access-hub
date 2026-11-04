import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { memo, useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import type { ComposedChartProps } from "recharts";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Search,
  Target,
} from "lucide-react";
import { getInitiatives, type InitiativeRow } from "@/server/savings";
import { DATA_COLUMNS, COLUMN_MAP, FILTER_FIELDS, MONTHS, DEFAULT_VISIBLE_COLUMNS } from "@/lib/data-columns";
import { toCsv, downloadCsv } from "@/lib/csv";
import { usd, usdCompact, kgs, num, pct } from "@/lib/format";
import { MultiSelect, ResetFiltersButton } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Control Center — Supply Chain" },
      { name: "description", content: "Savings initiative dashboard: filters, KPIs, trends and ROI heatmap." },
      { property: "og:title", content: "Control Center — Supply Chain" },
      { property: "og:description", content: "Savings initiative dashboard: filters, KPIs, trends and ROI heatmap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const initiativesQuery = queryOptions({
  queryKey: ["initiatives"],
  queryFn: useServerFn(getInitiatives),
});

function Dashboard() {
  const { data: rows } = useSuspenseQuery(initiativesQuery);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [drill, setDrill] = useState<{ type: string; sub: string } | null>(null);

  const options = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const f of FILTER_FIELDS) {
      const values = new Set<string>();
      for (const row of rows) {
        const v = row[f.column];
        if (v != null && String(v).trim() !== "") values.add(String(v));
      }
      map[f.column] = [...values].sort();
    }
    return map;
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) =>
      FILTER_FIELDS.every((f) => {
        const sel = filters[f.column];
        if (!sel || sel.length === 0 || sel.length === options[f.column].length) return true;
        return sel.includes(String(row[f.column]));
      }),
    );
  }, [rows, filters, options]);

  const drillRows = useMemo(
    () =>
      drill
        ? filtered.filter(
            (r) => String(r.initiative_type) === drill.type && String(r.sub_category) === drill.sub,
          )
        : [],
    [filtered, drill],
  );

  function reset() {
    setFilters({});
  }

  return (
    <div className="space-y-6">
      <GlobalFilters filters={filters} options={options} onChange={setFilters} onReset={reset} />
      <KpiCards rows={filtered} />
      <div className="grid gap-4 xl:grid-cols-2">
        <TrendChart rows={filtered} />
        <RoiHeatmap rows={filtered} onCellClick={setDrill} />
      </div>
      <Registry rows={filtered} />
      <DrillDialog
        cell={drill}
        rows={drillRows}
        onClose={() => setDrill(null)}
      />
    </div>
  );
}

/* ---------------- filters ---------------- */

function GlobalFilters({
  filters,
  options,
  onChange,
  onReset,
}: {
  filters: Record<string, string[]>;
  options: Record<string, string[]>;
  onChange: (f: Record<string, string[]>) => void;
  onReset: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
        <CardTitle className="font-display text-sm font-semibold text-foreground">Global Filters</CardTitle>
        <ResetFiltersButton onClick={onReset} />
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 pt-4 sm:grid-cols-4 xl:grid-cols-8">
        {FILTER_FIELDS.map((f) => (
          <MultiSelect
            key={f.column}
            label={f.label}
            options={options[f.column] ?? []}
            selected={filters[f.column] ?? []}
            onChange={(sel) => onChange({ ...filters, [f.column]: sel })}
          />
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------- KPIs ---------------- */

function sum(rows: InitiativeRow[], col: string): number {
  return rows.reduce((acc, r) => acc + (typeof r[col] === "number" ? (r[col] as number) : 0), 0);
}

function KpiCards({ rows }: { rows: InitiativeRow[] }) {
  const ytdSpend = sum(rows, "ytd_sep26_12mths_po_spends_usd");
  const aopSpend = sum(rows, "aop27_spends");
  const productivity = sum(rows, "annual_productivity");
  const actualYtd = sum(rows, "actual_savings_ytd");
  const plannedFy27 = MONTHS.reduce((acc, m) => acc + sum(rows, m.saving), 0);
  const savingsRate = aopSpend > 0 ? productivity / aopSpend : null;
  const vol = sum(rows, "ytd_sep26_12mths_po_qty_kgs");

  const cards = [
    { label: "YTD PO Spend", value: usdCompact(ytdSpend), sub: `${kgs(vol)} purchased`, delta: null },
    { label: "AOP27 Spend Plan", value: usdCompact(aopSpend), sub: `${usdCompact(plannedFy27)} planned FY27 savings`, delta: null },
    {
      label: "Annual Productivity",
      value: usdCompact(productivity),
      sub: savingsRate != null ? `${pct(savingsRate)} of AOP27 spend` : "—",
      delta: productivity >= 0,
    },
    {
      label: "Actual Savings (YTD)",
      value: usdCompact(actualYtd),
      sub: `${rows.length} initiatives in view`,
      delta: actualYtd >= 0,
    },
    {
      label: "Savings Target Coverage",
      value: plannedFy27 > 0 ? pct(actualYtd / plannedFy27) : "—",
      sub: "Actual vs. planned FY27",
      delta: null,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.label} className="py-4">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
              {c.delta != null &&
                (c.delta ? (
                  <ArrowUpRight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-destructive" />
                ))}
            </div>
            <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">{c.value}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{c.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- charts ---------------- */

const CHART_COLORS = "var(--color-primary)";
const CHART_COLORS_2 = "var(--color-chart-2)";

function TrendChart({ rows }: { rows: InitiativeRow[] }) {
  const data = MONTHS.map((m) => ({
    month: m.label,
    planned: Math.round(sum(rows, m.saving)),
    actual: Math.round(sum(rows, m.actuals)),
  }));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-sm font-semibold text-foreground">
          Savings &amp; Volume Trend (FY27)
        </CardTitle>
        <p className="text-xs text-muted-foreground">Planned savings vs. actuals, USD</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} interval={1} />
            <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} tickFormatter={(v) => usdCompact(Number(v))} width={64} />
            <Tooltip
              contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
              formatter={(value, name) => [usd(Number(value)), name === "planned" ? "Planned savings" : "Actuals"]}
            />
            <Legend
              formatter={(v: string) => <span style={{ color: "var(--color-muted-foreground)", fontSize: 11 }}>{v === "planned" ? "Planned savings" : "Actuals"}</span>}
            />
            <Bar dataKey="planned" fill={CHART_COLORS} radius={[3, 3, 0, 0]} maxBarSize={26} />
            <Line dataKey="actual" stroke={CHART_COLORS_2} strokeWidth={2} dot={{ r: 2.5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/* ---------------- heatmap ---------------- */

const HEAT_MIN = 0;
const HEAT_MAX = 0.05; // ROI above 5% of spend saturates the scale

function heatColor(roi: number, min: number, max: number): { bg: string; strong: boolean } {
  const span = Math.max(max - min, 1e-9);
  const t = Math.min(1, Math.max(0, (roi - min) / span));
  return {
    bg: `color-mix(in oklab, var(--heatmap-hi) ${Math.round(t * 100)}%, var(--heatmap-lo))`,
    strong: t > 0.55,
  };
}

const HeatCell = memo(function HeatCell({
  type,
  sub,
  rows,
  min,
  max,
  onClick,
}: {
  type: string;
  sub: string;
  rows: InitiativeRow[];
  min: number;
  max: number;
  onClick: () => void;
}) {
  const cellRows = rows.filter((r) => String(r.initiative_type) === type && String(r.sub_category) === sub);
  const spend = sum(cellRows, "aop27_spends");
  const prod = sum(cellRows, "annual_productivity");
  const roi = spend > 0 ? prod / spend : null;
  if (roi == null) {
    return <div className="flex h-12 items-center justify-center rounded-sm bg-muted/40 text-[10px] text-muted-foreground">—</div>;
  }
  const { bg, strong } = heatColor(roi, min, max);
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${type} × ${sub}\nSavings ${usd(prod)} on spend ${usd(spend)} — ROI ${pct(roi)}`}
      className="flex h-12 flex-col items-center justify-center rounded-sm text-center transition-transform hover:scale-[1.04] hover:shadow-md"
      style={{ background: bg, color: strong ? "var(--color-primary-foreground)" : "var(--color-foreground)" }}
    >
      <span className="text-[11px] font-semibold">{pct(roi)}</span>
      <span className="text-[9px] opacity-80">{cellRows.length} init.</span>
    </button>
  );
});

function RoiHeatmap({
  rows,
  onCellClick,
}: {
  rows: InitiativeRow[];
  onCellClick: (cell: { type: string; sub: string }) => void;
}) {
  const { types, subs, min, max } = useMemo(() => {
    const types = [...new Set(rows.map((r) => String(r.initiative_type ?? "—")))].sort();
    const subs = [...new Set(rows.map((r) => String(r.sub_category ?? "—")))].sort();
    let min = HEAT_MAX;
    let max = HEAT_MIN;
    for (const t of types)
      for (const s of subs) {
        const cell = rows.filter((r) => String(r.initiative_type) === t && String(r.sub_category) === s);
        const spend = sum(cell, "aop27_spends");
        if (spend <= 0) continue;
        const roi = sum(cell, "annual_productivity") / spend;
        min = Math.min(min, roi);
        max = Math.max(max, roi);
      }
    if (min > max) {
      min = 0;
      max = HEAT_MAX;
    }
    return { types, subs, min, max };
  }, [rows]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-sm font-semibold text-foreground">
          Savings Efficiency &amp; ROI Heatmap
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Initiative type vs. sub-category — share of spend returned as savings. Click a cell for details.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-1">
          <div className="min-w-max">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `140px repeat(${subs.length}, minmax(72px, 1fr))` }}
            >
              <div />
              {subs.map((s) => (
                <div key={s} className="truncate px-1 pb-1 text-center text-[10px] font-medium text-muted-foreground" title={s}>
                  {s}
                </div>
              ))}
              {types.map((t) => (
                <div key={t} className="contents">
                  <div className="flex h-12 items-center truncate pr-2 text-right text-[10px] font-medium text-foreground" title={t}>
                    {t}
                  </div>
                  {subs.map((s) => (
                    <HeatCell
                      key={`${t}|${s}`}
                      type={t}
                      sub={s}
                      rows={rows}
                      min={min}
                      max={max}
                      onClick={() => onCellClick({ type: t, sub: s })}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>Low ROI</span>
          <span
            className="h-2.5 w-32 rounded-full"
            style={{ background: "linear-gradient(90deg, var(--heatmap-lo), var(--heatmap-hi))" }}
          />
          <span>High ROI</span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- drill-down dialog ---------------- */

function DrillDialog({
  cell,
  rows,
  onClose,
}: {
  cell: { type: string; sub: string } | null;
  rows: InitiativeRow[];
  onClose: () => void;
}) {
  const cols = ["material_name", "plant", "catergory_manager", "project_name_supplier", "aop27_spends", "annual_productivity", "actual_savings_ytd"];
  return (
    <Dialog open={cell != null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">
            {cell ? `${cell.type} — ${cell.sub}` : ""}
          </DialogTitle>
          <DialogDescription>
            {rows.length} initiative{rows.length === 1 ? "" : "s"} in this cell ·{" "}
            {usd(sum(rows, "annual_productivity"))} savings on {usd(sum(rows, "aop27_spends"))} spend
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-auto rounded-md border border-border">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                {cols.map((c) => (
                  <TableHead key={c} className="text-[11px]">{COLUMN_MAP.get(c)?.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  {cols.map((c) => (
                    <TableCell key={c} className="max-w-40 truncate text-xs">
                      {c === "aop27_spends" || c === "annual_productivity" || c === "actual_savings_ytd"
                        ? usd(r[c] as number)
                        : String(r[c] ?? "—")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={cols.length} className="py-8 text-center text-xs text-muted-foreground">
                    No initiatives
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- registry table ---------------- */

function Registry({ rows }: { rows: InitiativeRow[] }) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => visible.some((c) => String(r[c] ?? "").toLowerCase().includes(q)));
  }, [rows, query, visible]);

  function exportCsv() {
    downloadCsv("savings-initiatives.csv", toCsv(searched, visible));
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 border-b border-border pb-3">
        <div>
          <CardTitle className="font-display text-sm font-semibold text-foreground">
            Filtered Master Data Registry
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {searched.length} of {rows.length} records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records..."
              className="h-8 w-52 pl-8 text-xs"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 w-60 overflow-y-auto">
              <DropdownMenuLabel className="text-xs">Visible columns</DropdownMenuLabel>
              {DATA_COLUMNS.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.column}
                  checked={visible.includes(c.column)}
                  onCheckedChange={(checked) =>
                    setVisible((prev) =>
                      checked ? [...prev, c.column] : prev.filter((x) => x !== c.column),
                    )
                  }
                  onSelect={(e) => e.preventDefault()}
                  className="text-xs"
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" className="h-8 text-xs" onClick={exportCsv}>
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[520px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                {visible.map((c) => (
                  <TableHead key={c} className="whitespace-nowrap text-[11px]">
                    {COLUMN_MAP.get(c)?.label ?? c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {searched.map((r) => (
                <TableRow key={r.id}>
                  {visible.map((c) => {
                    const col = COLUMN_MAP.get(c);
                    const v = r[c];
                    return (
                      <TableCell key={c} className="max-w-56 truncate whitespace-nowrap text-xs">
                        {v == null
                          ? "—"
                          : col?.type === "number"
                            ? num(v as number, Number.isInteger(v) ? 0 : 2)
                            : String(v)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {searched.length === 0 && (
                <TableRow>
                  <TableCell colSpan={Math.max(visible.length, 1)} className="py-10 text-center text-sm text-muted-foreground">
                    No records match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Re-exported so tree-shaking keeps the Target icon import available for future header badges.
export const _icons = { Target, Link };
