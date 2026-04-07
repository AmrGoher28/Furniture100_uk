import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
}

const AdminLoginModal = ({ open, onClose, onLogin }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4" /> Admin Access
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            autoFocus
          />
          {error && <p className="text-xs text-destructive">Incorrect password</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginModal;
