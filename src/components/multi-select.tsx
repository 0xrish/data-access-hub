import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  const allSelected = selected.length === 0 || selected.length === options.length;
  const summary = allSelected
    ? "All"
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-input/40 px-3 text-left text-xs transition-colors hover:bg-input/60",
            open && "ring-2 ring-ring/50"
          )}
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </span>
            <span className="truncate text-foreground">{summary}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 text-[11px]">
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-primary"
            onClick={() => onChange(options)}
          >
            Select All
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-primary"
            onClick={() => onChange([])}
          >
            Clear
          </button>
        </div>
        <div ref={ref} className="max-h-56 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-muted-foreground">No matches</p>
          )}
          {filtered.map((option) => {
            const active = allSelected || selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-accent"
                onClick={() => {
                  if (allSelected) {
                    onChange([option]);
                  } else if (selected.includes(option)) {
                    onChange(selected.filter((s) => s !== option));
                  } else {
                    onChange([...selected, option]);
                  }
                }}
              >
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}
                >
                  {active && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="truncate">{option}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ResetFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="h-9 text-xs" onClick={onClick}>
      Reset
    </Button>
  );
}
