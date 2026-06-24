"use client";

const items = [
  "PREDICT THE FUTURE",
  "EARN REWARDS",
  "VIP ACCESS",
  "EXCLUSIVE CONTENT",
  "CREATOR ECONOMY",
  "SHOW YOUR FANDOM",
  "TRADE POSITIONS",
  "PRIVATE STREAMS",
];

export default function MarqueeStrip() {
  return (
    <div
      className="w-full overflow-hidden bg-[var(--color-inverse-canvas)] text-[var(--color-inverse-ink)]"
      style={{ height: 44 }}
    >
      <div className="flex items-center h-full animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-body-sm mx-8 opacity-80 shrink-0">
            {item}
            <span className="ml-8 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
