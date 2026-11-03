import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "viewer";

export function useMyRole() {
  return useQuery<AppRole | null>({
    queryKey: ["my-role"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).limit(1);
      if (error) throw new Error(error.message);
      return (data?.[0]?.role as AppRole) ?? null;
    },
  });
}
