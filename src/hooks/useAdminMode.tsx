import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const ADMIN_KEY = "swifliving_admin";
const ADMIN_PASSWORD = "Furniture100Admin";

interface AdminContextType {
  isAdmin: boolean;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  showLogin: false,
  setShowLogin: () => {},
  login: () => false,
  logout: () => {},
});

export const useAdminMode = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <AdminContext.Provider value={{ isAdmin, showLogin, setShowLogin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
