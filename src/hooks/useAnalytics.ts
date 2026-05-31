import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-BKR4STNHCX";

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("config", GA_ID, {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);
}
