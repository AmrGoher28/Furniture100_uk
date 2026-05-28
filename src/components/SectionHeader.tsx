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
    <div>
      {eyebrow && (
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-4 font-medium">
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          fontSize: "clamp(1.625rem, 3.2vw, 2.5rem)",
          letterSpacing: "-0.035em",
          lineHeight: 1.05,
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
    </div>
    {linkLabel && linkHref && (
      <Link
        to={linkHref}
        className="text-xs tracking-tight text-foreground/70 hover:text-foreground transition-colors"
      >
        {linkLabel} <span aria-hidden>→</span>
      </Link>
    )}
  </div>
);
