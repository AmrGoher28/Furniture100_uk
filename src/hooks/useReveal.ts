import { useEffect, useRef } from "react";

/**
 * Adds an `is-visible` class once the element scrolls into view.
 * Pair with the `.reveal` utility in index.css for a fade/slide-up entrance.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>(rootMargin = "0px 0px -10% 0px") => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return ref;
};
