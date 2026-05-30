import { Link } from "react-router-dom";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

/**
 * Calm editorial section header: small uppercase eyebrow above a
 * tight-tracked headline, with an optional right-aligned text link.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  className = "",
}: SectionHeaderProps) => (
  <div className={`flex items-end justify-between gap-6 flex-wrap ${className}`}>
    <h2
      className="flex items-baseline gap-3"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.05 }}
    >
      {eyebrow && (
        <span className="font-serif-display italic font-medium text-foreground">
          {eyebrow}
        </span>
      )}
      <span className="uppercase tracking-[0.04em] font-semibold text-foreground">
        {title}
      </span>
    </h2>
    {linkLabel && linkHref && (
      <Link
        to={linkHref}
        className="text-xs tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
      >
        {linkLabel} <span aria-hidden>→</span>
      </Link>
    )}
  </div>
);
