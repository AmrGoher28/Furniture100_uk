import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        navigate("/account");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to verify your account");
        toast.success("Your 10% discount code: WELCOME10", { duration: 10000 });
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-md mx-auto">
          <h1
            className="text-3xl md:text-4xl text-center mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-8 font-light">
            {isLogin
              ? "Sign in to access your wishlist and orders"
              : "Join us and get 10% off your first order"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground text-sm font-light focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground text-sm font-light focus:outline-none focus:ring-2 focus:ring-gold/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-walnut-dark text-primary-foreground py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-light">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:underline"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;
