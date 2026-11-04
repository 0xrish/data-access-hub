import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    if (!isSupabaseConfigured()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Supply Chain Control Center" },
      { name: "description", content: "Sign in to the savings initiatives control center." },
      { property: "og:title", content: "Sign in — Supply Chain Control Center" },
      { property: "og:description", content: "Sign in to the savings initiatives control center." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="font-display text-lg font-semibold text-foreground">
            Sign-in setup is incomplete
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add the Supabase project publishable key to both SUPABASE_PUBLISHABLE_KEY and
            VITE_SUPABASE_PUBLISHABLE_KEY in your local environment file, then restart the dev
            server.
          </p>
          <Button asChild variant="outline" className="mt-5 w-full">
            <a href="/">Return to home</a>
          </Button>
        </div>
      </div>
    );
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy("email");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/dashboard" });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) await supabase.auth.signOut();
        toast.success("Account created. An administrator must approve access before you can continue.");
        setMode("signin");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
            SC
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Supply Chain Control Center
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to view savings initiatives" : "Create your account"}
          </p>
        </div>

        <form
          onSubmit={handleEmail}
          className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy !== null}>
            {busy === "email" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "signin" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>
          <button
            type="button"
            className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            New accounts need administrator approval before they can view data.
          </p>
        </form>
      </div>
    </div>
  );
}
