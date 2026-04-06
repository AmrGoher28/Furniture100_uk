import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    <section className="bg-walnut-dark py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4">
          Get 10% Off Your First Order
        </h2>
        <p className="text-primary-foreground/60 mb-8 leading-relaxed font-light">
          Join thousands of happy customers and be first to hear about new arrivals and exclusive deals
        </p>

        {discountCode ? (
          <div className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-primary-foreground/60 text-sm font-light mb-2">Your discount code:</p>
            <p className="text-2xl font-medium text-gold tracking-widest mb-2">{discountCode}</p>
            <p className="text-primary-foreground/40 text-xs font-light">
              Use this at checkout for 10% off your order
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm font-light focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gold text-primary-foreground px-6 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Get 10% Off"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
