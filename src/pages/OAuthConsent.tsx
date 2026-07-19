import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";

type AuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauthApi = () => (supabase.auth as unknown as { oauth: AuthOAuth }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load authorization");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    try {
      const { data, error } = approve
        ? await oauthApi().approveAuthorization(authorizationId)
        : await oauthApi().denyAuthorization(authorizationId);
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setError("No redirect returned by the authorization server.");
        setBusy(false);
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setError(e?.message ?? "Authorization failed");
      setBusy(false);
    }
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-md mx-auto border border-border rounded-lg p-8 bg-background">
          {error ? (
            <>
              <h1 className="text-2xl mb-3">Authorization error</h1>
              <p className="text-sm text-muted-foreground font-light">{error}</p>
            </>
          ) : !details ? (
            <p className="text-sm text-muted-foreground font-light">Loading…</p>
          ) : (
            <>
              <h1 className="text-2xl mb-2">
                Connect {details.client?.name ?? "an app"} to Furniture100
              </h1>
              <p className="text-sm text-muted-foreground font-light mb-6">
                This lets {details.client?.name ?? "the app"} use Furniture100 as you. It can browse
                the catalogue and read your wishlist and price offers. It cannot bypass Furniture100's
                account permissions.
              </p>
              <div className="flex gap-3">
                <button
                  disabled={busy}
                  onClick={() => decide(true)}
                  className="flex-1 bg-walnut-dark text-primary-foreground py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {busy ? "Please wait…" : "Approve"}
                </button>
                <button
                  disabled={busy}
                  onClick={() => decide(false)}
                  className="flex-1 border border-border py-3 rounded-md text-sm font-medium tracking-wide hover:bg-muted transition-colors disabled:opacity-50"
                >
                  Deny
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
