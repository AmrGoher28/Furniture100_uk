import { useState, useEffect, useCallback } from "react";

const ADMIN_KEY = "swifliving_admin";
const ADMIN_PASSWORD = "Furniture100Admin";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_KEY) === "true");
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" && !isAdmin) {
      setShowLogin(true);
    }
  }, [isAdmin]);

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);
      setShowLogin(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, showLogin, setShowLogin, login, logout };
}
