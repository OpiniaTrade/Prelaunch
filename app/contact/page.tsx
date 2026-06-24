"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-[var(--color-hairline)]">
        <Link href="/" className="text-[22px] font-[700] tracking-tight">
          OPINIA
        </Link>
        <Link
          href="/waitlist"
          className="inline-flex items-center px-5 py-2 rounded-full bg-black text-white text-body-sm"
        >
          Join Waitlist
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="mb-10">
            <p className="text-eyebrow mb-3 opacity-60">GET IN TOUCH</p>
            <h1 className="text-display-lg mb-4">Contact Us</h1>
            <p className="text-body-lg opacity-70">
              Have a question, partnership idea, or just want to say hi? Drop us
              a message.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-[20px] bg-[var(--color-block-mint)] p-8 text-center">
              <h3 className="text-headline mb-2">Message sent! ✓</h3>
              <p className="text-body">
                Thanks for reaching out. We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-caption block mb-2">NAME</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-[8px] border border-[var(--color-hairline)] text-body focus:outline-none focus:ring-2 focus:ring-[var(--color-block-lilac)]"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-caption block mb-2">
                  EMAIL / CONTACT
                </label>
                <input
                  type="text"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-[8px] border border-[var(--color-hairline)] text-body focus:outline-none focus:ring-2 focus:ring-[var(--color-block-lilac)]"
                  placeholder="you@example.com or phone"
                />
              </div>

              <div>
                <label className="text-caption block mb-2">MESSAGE</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[8px] border border-[var(--color-hairline)] text-body focus:outline-none focus:ring-2 focus:ring-[var(--color-block-lilac)] resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-full bg-black text-white text-button disabled:opacity-50"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>

              {status === "error" && (
                <p className="text-body-sm text-[#d32f2f] text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}

          {/* Socials */}
          <div className="mt-12 pt-8 border-t border-[var(--color-hairline)]">
            <p className="text-caption mb-4 opacity-60">OR REACH US DIRECTLY</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://twitter.com/${(process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@opinia").replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-lg hover:text-[var(--color-accent-magenta)] transition-colors"
                >
                  𝕏 {process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@opinia"}
                </a>
                <a
                  href={`https://twitter.com/${(process.env.NEXT_PUBLIC_TWITTER_HANDLE_2 || "@opinia_co").replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-lg hover:text-[var(--color-accent-magenta)] transition-colors"
                >
                  𝕏 {process.env.NEXT_PUBLIC_TWITTER_HANDLE_2 || "@opinia_co"}
                </a>
              </div>
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "hello@opinia.xyz"}`}
                className="text-body-lg hover:text-[var(--color-accent-magenta)] transition-colors"
              >
                ✉ {process.env.NEXT_PUBLIC_EMAIL || "hello@opinia.xyz"}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
