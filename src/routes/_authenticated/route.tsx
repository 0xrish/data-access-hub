import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Database, Upload, Users2, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// The integration-managed gate: client-only (session lives in browser storage).
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
  },
  component: AuthenticatedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Control Center", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Data", icon: Upload, adminOnly: true },
  { to: "/users", label: "User Access", icon: Users2, adminOnly: true },
];

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "viewer" | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });
    supabase
      .from("user_roles")
      .select("role")
      .limit(1)
      .then(({ data }) => {
        if (active) setRole((data?.[0]?.role as "admin" | "viewer") ?? null);
      });
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-6 px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Database className="size-4" />
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Supply Chain Control Center
            </span>
          </Link>
          <nav className="flex flex-1 items-center gap-1">
            {NAV.filter((n) => !n.adminOnly || role === "admin").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: false }}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 font-display text-[11px] font-semibold text-primary">
                  {(email ?? "?").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-40 truncate sm:inline">{email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="size-3.5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
