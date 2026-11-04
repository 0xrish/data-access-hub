import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Filter,
  Flame,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Supply Chain Control Center — Savings Initiatives" },
      {
        name: "description",
        content:
          "Track procurement savings initiatives: global filters, spend trends, ROI heatmap and a full data registry with role-based access.",
      },
      { property: "og:title", content: "Supply Chain Control Center — Savings Initiatives" },
      {
        property: "og:description",
        content: "Track procurement savings initiatives with filters, trends and ROI heatmaps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Filter,
    title: "Global filters",
    body: "Slice the registry by region, plant, sub-category, initiative type, manager and material — all at once.",
  },
  {
    icon: TrendingUp,
    title: "Spend & savings trends",
    body: "Planned savings and monthly actuals for FY27, KPIs for YTD spend, AOP27 and productivity.",
  },
  {
    icon: Flame,
    title: "Savings ROI heatmap",
    body: "Initiative type vs. sub-category efficiency. Click any cell to drill into the initiatives behind it.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    body: "Admins upload new data and manage user access; everyone else gets a clean read-only view.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary font-display text-xs font-bold text-primary-foreground">
            SC
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-foreground">
            Supply Chain Control Center
          </span>
        </div>
        <Button asChild size="sm">
          <Link to="/auth">
            Sign in <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-16 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          Procurement · FY27 savings program
        </p>
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Every savings initiative, <span className="text-primary">one control center</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          A single, clean view of your dyes &amp; chemicals cost-savings pipeline — filtered, measured and exportable.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/auth">
              Open the control center <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <f.icon className="mb-3 size-5 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
