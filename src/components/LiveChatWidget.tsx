import { MessageCircle } from "lucide-react";

export const LiveChatWidget = () => {
  return (
    <button
      onClick={() => {
        // TODO: wire up live chat provider (Tidio, Intercom, etc.)
        alert("Live chat coming soon! For now, email hello@furniture100.co.uk");
      }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gold text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      aria-label="Open live chat"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};
