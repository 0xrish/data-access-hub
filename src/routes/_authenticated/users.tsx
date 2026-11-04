import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Search, Shield, ShieldCheck, Users2 } from "lucide-react";
import { listUsers, setUserRole, type ManagedUser } from "@/functions/users";
import { useMyRole } from "@/hooks/use-role";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/users")({
  head: () => ({
    meta: [
      { title: "User Access — Supply Chain Control Center" },
      {
        name: "description",
        content: "Manage user roles: promote to admin or demote to viewer.",
      },
      { property: "og:title", content: "User Access — Supply Chain Control Center" },
      {
        property: "og:description",
        content: "Role management for the savings initiatives control center.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UsersPage,
});

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function UsersPage() {
  const { data: role, isLoading: roleLoading } = useMyRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const listFn = useServerFn(listUsers);
  const setRoleFn = useServerFn(setUserRole);

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<ManagedUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => listFn(),
    enabled: role === "admin",
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "viewer" | "pending" }) =>
      setRoleFn({ data: { userId, role } }),
    onSuccess: () => {
      toast.success("Role updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.role ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  if (roleLoading || isLoading) {
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
          Only administrators can manage user access. Contact your admin to request access.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
        <AlertTriangle className="size-10 text-destructive" />
        <h2 className="font-display text-lg font-semibold text-foreground">Error</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Failed to load users"}
        </p>
      </div>
    );
  }

  const adminCount = users.filter((u) => u.role === "admin").length;
  const viewerCount = users.filter((u) => u.role === "viewer").length;
  const pendingCount = users.filter((u) => u.role === "pending" || u.role == null).length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          User Access Management
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve accounts as viewers for read-only access, or grant admin rights for uploads and user management.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Users2 className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Users
              </p>
              <p className="font-display text-2xl font-semibold text-foreground">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Pending Approval
              </p>
              <p className="font-display text-2xl font-semibold text-foreground">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Admins
              </p>
              <p className="font-display text-2xl font-semibold text-foreground">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent className="flex items-center gap-3 px-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
              <Shield className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Viewers
              </p>
              <p className="font-display text-2xl font-semibold text-foreground">{viewerCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User table */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border pb-3">
          <CardTitle className="font-display text-sm font-semibold text-foreground">
            Registered Users
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by email..."
              className="h-8 w-56 pl-8 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[520px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card">
                <TableRow>
                  <TableHead className="text-[11px]">Email</TableHead>
                  <TableHead className="text-[11px]">Role</TableHead>
                  <TableHead className="text-[11px]">Created</TableHead>
                  <TableHead className="text-[11px]">Last Sign-in</TableHead>
                  <TableHead className="text-right text-[11px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="text-xs font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {user.role === "admin" ? (
                          <ShieldCheck className="mr-1 size-3" />
                        ) : (
                          <Shield className="mr-1 size-3" />
                        )}
                        {user.role ?? "none"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(user.lastSignInAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role ?? "pending"}
                        onValueChange={(newRole) =>
                          mutation.mutate({
                            userId: user.userId,
                            role: newRole as "admin" | "viewer" | "pending",
                          })
                        }
                        disabled={mutation.isPending}
                      >
                        <SelectTrigger className="h-7 w-28 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin" className="text-xs">
                            Admin
                          </SelectItem>
                          <SelectItem value="viewer" className="text-xs">
                            Approve as Viewer
                          </SelectItem>
                          <SelectItem value="pending" className="text-xs">
                            Pending
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      {query ? "No users match your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
