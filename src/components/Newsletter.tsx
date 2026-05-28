import { useState } from "react";
import { toast } from "sonner";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Your discount code: WELCOME10");
  };

  return (
    <section className="bg-background py-24 md:py-32 px-6 border-t border-border">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-5 font-medium">Newsletter</p>
        <h2
          className="text-foreground mb-10"
          style={{
            fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            fontWeight: 500,
          }}
        >
          Get 10% off your first order.
        </h2>

        {submitted ? (
          <p className="text-sm text-foreground">
            Use code <span className="font-medium tracking-[0.15em]">WELCOME10</span> at checkout.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-4 max-w-md mx-auto border-b border-border focus-within:border-foreground transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="text-xs tracking-[0.15em] uppercase text-foreground hover:opacity-60 transition-opacity py-3"
            >
              Subscribe →
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
