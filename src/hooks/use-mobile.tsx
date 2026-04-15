import * as React from "react";

const MOBILE_BREAKPOINT = 768;

const mql =
  typeof window !== "undefined"
    ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    : null;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => mql?.matches ?? false
  );

  React.useEffect(() => {
    if (!mql) return;
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
