const TRUST_LINES = [
  "Free UK delivery",
  "30 day returns",
  "Klarna available at checkout",
];

const ProductTrustBadges = () => (
  <ul className="border-y border-border py-5 my-6 space-y-2">
    {TRUST_LINES.map((line) => (
      <li key={line} className="text-xs tracking-tight text-muted-foreground">
        {line}
      </li>
    ))}
  </ul>
);

export default ProductTrustBadges;
