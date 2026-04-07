import { useState } from "react";
import { Pencil, Check, X, Bold, Italic } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onSave: (value: string) => void;
  isAdmin: boolean;
  label?: string;
  multiline?: boolean;
}

const InlineEditor = ({ value, onSave, isAdmin, label, multiline = true }: Props) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!isAdmin) return null;

  if (!editing) {
    return (
      <button
        onClick={() => { setDraft(value); setEditing(true); }}
        className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors ml-1"
        title={`Edit ${label || "content"}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    );
  }

  const insertTag = (tag: string) => {
    setDraft((d) => d + `<${tag}></${tag}>`);
  };

  return (
    <div className="mt-2 border border-blue-300 rounded-lg p-3 bg-blue-50/50 space-y-2">
      {label && <p className="text-[10px] uppercase tracking-wider text-blue-600 font-medium">{label}</p>}
      <div className="flex gap-1 mb-1">
        <button onClick={() => insertTag("b")} className="p-1 rounded hover:bg-blue-100 text-blue-600" title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => insertTag("i")} className="p-1 rounded hover:bg-blue-100 text-blue-600" title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
      </div>
      {multiline ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="text-sm min-h-[80px] border-blue-200 focus-visible:ring-blue-400"
          autoFocus
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full text-sm border border-blue-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          autoFocus
        />
      )}
      <div className="flex gap-2">
        <button
          onClick={() => { onSave(draft); setEditing(false); }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          <Check className="w-3 h-3" /> Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-secondary transition-colors"
        >
          <X className="w-3 h-3" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default InlineEditor;
