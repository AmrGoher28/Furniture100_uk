import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LiveChatWidget } from "./LiveChatWidget";

interface LayoutProps {
  children: React.ReactNode;
  heroPage?: boolean;
}

export const Layout = ({ children, heroPage = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className={`flex-1 ${heroPage ? "" : "pt-16 md:pt-[72px]"}`}>{children}</main>
      <Footer />
      <LiveChatWidget />
    </div>
  );
};
