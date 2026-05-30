import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { Mail, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    try {
      const id = crypto.randomUUID();

      // Send confirmation to customer
      const confirmPromise = supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-confirmation",
          recipientEmail: form.email,
          idempotencyKey: `contact-confirm-${id}`,
          templateData: { name: form.name },
        },
      });

      // Send notification to admin
      const notifyPromise = supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contact-notification",
          idempotencyKey: `contact-notify-${id}`,
          templateData: {
            name: form.name,
            email: form.email,
            subject: form.subject,
            message: form.message,
          },
        },
      });

      const [confirmRes, notifyRes] = await Promise.all([confirmPromise, notifyPromise]);

      if (confirmRes.error || notifyRes.error) {
        throw new Error("Failed to send");
      }

      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <Seo title="Contact Us | Furniture100" description="Get in touch with Furniture100 - questions about orders, delivery or products. We're here to help." path="/contact" />
      <section className="bg-secondary py-16 md:py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">We'd love to hear from you. Get in touch and we'll respond as soon as we can.</p>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Contact details */}
          <div>
            <h2 className="text-2xl mb-6">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Email</p>
                  <a href="mailto:hello@furniture100.co.uk" className="text-sm text-muted-foreground hover:text-gold transition-colors">hello@furniture100.co.uk</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Hours</p>
                  <p className="text-sm text-muted-foreground">Monday – Friday, 9am – 5pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Location</p>
                  <p className="text-sm text-muted-foreground">United Kingdom</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={100}
                  className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  maxLength={255}
                  className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  maxLength={200}
                  className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  maxLength={2000}
                  rows={5}
                  className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
