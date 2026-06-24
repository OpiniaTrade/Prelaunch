import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
      {/* Big 404 */}
      <div className="relative mb-8">
        <h1
          className="text-[180px] md:text-[240px] font-[700] leading-none tracking-tight select-none"
          style={{
            color: "var(--color-hairline)",
          }}
        >
          404
        </h1>
        {/* Overlay character peeking from behind the 0 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ marginTop: -10 }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            {/* Body */}
            <rect
              x="8"
              y="15"
              width="44"
              height="40"
              rx="14"
              fill="#1f1d3d"
            />
            {/* Eyes */}
            <circle cx="22" cy="32" r="6" fill="white" />
            <circle cx="38" cy="32" r="6" fill="white" />
            {/* Pupils — looking around confused */}
            <circle cx="24" cy="33" r="3" fill="#1f1d3d" />
            <circle cx="36" cy="31" r="3" fill="#1f1d3d" />
            {/* Eyebrows — confused */}
            <rect
              x="16"
              y="23"
              width="10"
              height="3"
              rx="1.5"
              fill="#c5b0f4"
              transform="rotate(-15 21 24)"
            />
            <rect
              x="34"
              y="23"
              width="10"
              height="3"
              rx="1.5"
              fill="#c5b0f4"
              transform="rotate(20 39 24)"
            />
            {/* Confused mouth */}
            <path
              d="M22,44 Q26,41 30,44 Q34,47 38,43"
              fill="none"
              stroke="#c5b0f4"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-headline mb-3">Page not found</h2>
      <p className="text-body-lg opacity-70 max-w-md mb-10">
        Looks like this prediction didn&apos;t come true. The page you&apos;re
        looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-black text-white text-button"
        >
          Back to Home
        </Link>
        <Link
          href="/waitlist"
          className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-black text-button border border-[var(--color-hairline)]"
        >
          Join Waitlist
        </Link>
      </div>
    </div>
  );
}
