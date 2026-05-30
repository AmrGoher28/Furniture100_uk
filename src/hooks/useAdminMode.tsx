import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  logout: async () => {},
});

export const useAdminMode = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkRole = useCallback(async (userId: string | null) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (error) {
      console.error("admin role check failed", error);
      setIsAdmin(false);
      return;
    }
    setIsAdmin(Boolean(data));
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await checkRole(data.session?.user?.id ?? null);
      if (mounted) setLoading(false);
    });

    // React to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer Supabase calls to avoid recursive listener
      setTimeout(() => {
        checkRole(session?.user?.id ?? null);
      }, 0);
    });

    // Redirect legacy ?admin=true entry point to the auth page
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      params.delete("admin");
      const next = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", next);
      if (!isAdmin) window.location.assign("/auth");
    }

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkRole]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, loading, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
