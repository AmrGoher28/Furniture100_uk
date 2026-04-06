import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Link } from "react-router-dom";

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: ConsentPreferences) => {
    localStorage.setItem("cookie_consent", JSON.stringify({ ...prefs, timestamp: Date.now() }));
    setVisible(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-card border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
                <Link to="/privacy" className="underline text-foreground hover:text-primary transition-colors">
                  Learn more
                </Link>
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="rounded-full text-xs"
                >
                  Manage Preferences
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="rounded-full text-xs"
                >
                  Accept All
                </Button>
              </div>
            </div>

            {showPreferences && (
              <div className="border-t border-border pt-3 animate-in fade-in duration-300">
                <div className="grid gap-3 sm:grid-cols-3 mb-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Essential</p>
                      <p className="text-xs text-muted-foreground">Always active</p>
                    </div>
                    <Switch checked disabled />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Analytics</p>
                      <p className="text-xs text-muted-foreground">Usage data</p>
                    </div>
                    <Switch
                      checked={preferences.analytics}
                      onCheckedChange={(v) => setPreferences((p) => ({ ...p, analytics: v }))}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Marketing</p>
                      <p className="text-xs text-muted-foreground">Personalised ads</p>
                    </div>
                    <Switch
                      checked={preferences.marketing}
                      onCheckedChange={(v) => setPreferences((p) => ({ ...p, marketing: v }))}
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleSavePreferences} className="rounded-full text-xs">
                  Save Preferences
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
