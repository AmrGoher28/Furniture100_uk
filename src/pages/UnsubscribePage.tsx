import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "used" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const validateToken = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("used");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };

    validateToken();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus("success");
      } else if (data?.reason === "already_unsubscribed") {
        setStatus("used");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="font-heading text-2xl mb-4 text-foreground">Email Preferences</h1>

          {status === "loading" && (
            <p className="text-muted-foreground">Verifying your request…</p>
          )}

          {status === "valid" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Would you like to unsubscribe from Furniture100 emails?
              </p>
              <button
                onClick={handleUnsubscribe}
                className="bg-foreground text-background px-8 py-3 text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Confirm Unsubscribe
              </button>
            </div>
          )}

          {status === "success" && (
            <p className="text-muted-foreground">
              You've been unsubscribed. You won't receive any more emails from us.
            </p>
          )}

          {status === "used" && (
            <p className="text-muted-foreground">
              You've already unsubscribed from our emails.
            </p>
          )}

          {status === "invalid" && (
            <p className="text-muted-foreground">
              This unsubscribe link is invalid or has expired.
            </p>
          )}

          {status === "error" && (
            <p className="text-muted-foreground">
              Something went wrong. Please try again later.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UnsubscribePage;
