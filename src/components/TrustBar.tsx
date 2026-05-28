const TRUST_ITEMS = [
  "Free UK Delivery",
  "30 Day Returns",
  "Rated Excellent",
  "Klarna Available",
];

export const TrustBar = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 md:py-6">
        <ul className="flex items-center justify-between md:justify-center gap-3 md:gap-16 text-foreground/70 overflow-hidden">
          {TRUST_ITEMS.map((label, i) => (
            <li
              key={label}
              className={`text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.18em] uppercase font-medium whitespace-nowrap ${
                i === 3 ? "hidden sm:block" : ""
              }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
