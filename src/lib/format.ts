export const usd = (v: number | null | undefined, digits = 0) => {
  if (v == null || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
};

export const usdCompact = (v: number | null | undefined) => {
  if (v == null || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);
};

export const kgs = (v: number | null | undefined) => {
  if (v == null || Number.isNaN(v)) return "—";
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v)} kg`;
};

export const num = (v: number | null | undefined, digits = 0) => {
  if (v == null || Number.isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
};

export const pct = (v: number | null | undefined, digits = 1) => {
  if (v == null || Number.isNaN(v)) return "—";
  return `${(v * 100).toFixed(digits)}%`;
};
