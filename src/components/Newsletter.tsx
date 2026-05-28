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
    <section className="bg-foreground py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-background/50 mb-5 font-medium">Newsletter</p>
        <h2 className="text-background mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", letterSpacing: "-0.03em" }}>
          Get 10% off your first order.
        </h2>
        <p className="text-background/65 mb-10 max-w-lg mx-auto">
          Be first to hear about new arrivals and exclusive offers.
        </p>

        {submitted ? (
          <div className="border border-background/20 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-background/60 text-xs uppercase tracking-widest mb-3">Your code</p>
            <p className="text-3xl font-semibold text-background tracking-[0.15em] mb-3">WELCOME10</p>
            <p className="text-background/50 text-xs">Use at checkout for 10% off.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 h-12 rounded-full bg-transparent border border-background/25 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-background transition-colors"
            />
            <button
              type="submit"
              className="bg-background text-foreground px-8 h-12 rounded-full text-sm font-medium hover:bg-background/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
