import { X } from "lucide-react";

interface Props {
  onExit: () => void;
}

const AdminBadge = ({ onExit }: Props) => (
  <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
    Admin Mode
    <button onClick={onExit} className="ml-1 hover:opacity-70 transition-opacity" title="Exit admin mode">
      <X className="w-3 h-3" />
    </button>
  </div>
);

export default AdminBadge;
