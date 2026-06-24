"use client";

import { useState } from "react";
import Link from "next/link";

export default function WaitlistPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    suggestion: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", rating: 0, suggestion: "" });
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
          href="/contact"
          className="inline-flex items-center px-5 py-2 rounded-full border border-[var(--color-hairline)] text-black text-body-sm"
        >
          Contact Us
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="mb-10">
            <p className="text-eyebrow mb-3 opacity-60">EARLY ACCESS</p>
            <h1 className="text-display-lg mb-4">Join the Waitlist</h1>
            <p className="text-body-lg opacity-70">
              Be among the first to predict, earn, and shape the future of the
              creator economy.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-[20px] bg-[var(--color-block-lime)] p-8 text-center">
              <h3 className="text-headline mb-2">You&apos;re in! 🎉</h3>
              <p className="text-body">
                Welcome to the Opinia community. We&apos;ll notify you when we
                launch.
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

              {/* Rating */}
              <div>
                <label className="text-caption block mb-2">
                  HOW EXCITED ARE YOU? (OPTIONAL)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() =>
                        setForm({ ...form, rating: star })
                      }
                      className="text-[28px] transition-transform hover:scale-125"
                      style={{
                        filter:
                          star <= (hoverRating || form.rating)
                            ? "none"
                            : "grayscale(1) opacity(0.3)",
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                {form.rating > 0 && (
                  <p className="text-body-sm mt-2 opacity-60">
                    {form.rating === 5
                      ? "Let's gooo! 🚀"
                      : form.rating >= 3
                        ? "Glad to hear! 🙌"
                        : "We'll win you over! 💪"}
                  </p>
                )}
              </div>

              {/* Suggestions */}
              <div>
                <label className="text-caption block mb-2">
                  SUGGESTIONS (OPTIONAL)
                </label>
                <textarea
                  rows={4}
                  value={form.suggestion}
                  onChange={(e) =>
                    setForm({ ...form, suggestion: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[8px] border border-[var(--color-hairline)] text-body focus:outline-none focus:ring-2 focus:ring-[var(--color-block-lilac)] resize-none"
                  placeholder="What would you love to see in Opinia?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-full bg-black text-white text-button disabled:opacity-50"
              >
                {status === "loading" ? "Joining..." : "Join Waitlist"}
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
            <p className="text-caption mb-4 opacity-60">CONNECT WITH US</p>
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
