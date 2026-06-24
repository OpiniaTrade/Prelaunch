"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const steps = [
  {
    number: "01",
    title: "Predict",
    description:
      "Make predictions about your favorite creators. Will they post? Collaborate? Hit milestones? Hold or trade your positions as events unfold.",
    color: "var(--color-block-mint)",
    details: [
      "Choose from live prediction markets",
      "Take YES or NO positions",
      "Trade your positions anytime",
      "Watch the odds shift in real-time",
    ],
  },
  {
    number: "02",
    title: "Prove Your Fandom",
    description:
      "Earn reward tokens for correct predictions and use them to redeem exclusive rewards. The better you know your creator, the more you earn.",
    color: "var(--color-block-cream)",
    details: [
      "Earn creator-specific tokens",
      "Climb the fan leaderboard",
      "Build your prediction reputation",
      "Unlock higher reward tiers",
    ],
  },
  {
    number: "03",
    title: "Earn Exclusive Rewards",
    description:
      "Use your creator-specific tokens to redeem exclusive merch, VIP show tickets, exclusive content, exclusive streams, and what not.",
    color: "var(--color-block-pink)",
    details: [
      "VIP show tickets & backstage access",
      "Exclusive merch drops",
      "Private streams & early content",
      "1-on-1 interactions with creators",
    ],
  },
];

export default function ScrollTabs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isSnapping = useRef(false);
  const snapTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const snapToStep = useCallback((stepIndex: number) => {
    const container = containerRef.current;
    if (!container || isSnapping.current || isMobile) return;

    isSnapping.current = true;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const containerHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollableDistance = containerHeight - viewportHeight;
    const stepCenter = (stepIndex + 0.5) / steps.length;
    const targetScrollY = containerTop + stepCenter * scrollableDistance;

    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    setTimeout(() => { isSnapping.current = false; }, 600);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return; // No scroll-driven logic on mobile
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isSnapping.current) return;
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (containerHeight - viewportHeight)));
      const newIndex = Math.min(steps.length - 1, Math.floor(scrollProgress * steps.length));
      setActiveIndex(newIndex);

      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        if (isSnapping.current) return;
        const currentProgress = Math.max(0, Math.min(1, -rect.top / (containerHeight - viewportHeight)));
        if (currentProgress <= 0 || currentProgress >= 1) return;
        const stepFraction = (currentProgress * steps.length) % 1;
        if (stepFraction < 0.35 || stepFraction > 0.65) {
          const nearestStep = stepFraction < 0.35
            ? Math.floor(currentProgress * steps.length)
            : Math.ceil(currentProgress * steps.length);
          snapToStep(Math.max(0, Math.min(steps.length - 1, nearestStep)));
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => { window.removeEventListener("scroll", handleScroll); if (snapTimeout.current) clearTimeout(snapTimeout.current); };
  }, [snapToStep, isMobile]);

  // Mobile: simple vertical stacked layout
  if (isMobile) {
    return (
      <section className="w-full px-6 py-20">
        <div className="mb-10">
          <p className="text-eyebrow mb-3 text-[var(--color-ink)] opacity-60">HOW IT WORKS</p>
          <h2 className="text-display-lg">Three simple steps</h2>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.number} className="rounded-[20px] p-6" style={{ backgroundColor: step.color }}>
              <span className="text-caption opacity-50 mb-2 block">{step.number}</span>
              <h3 className="text-headline mb-3">{step.title}</h3>
              <p className="text-body mb-4">{step.description}</p>
              <div className="flex flex-wrap gap-2">
                {step.details.map((detail) => (
                  <span key={detail} className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/8 text-body-sm text-sm">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Desktop: scroll-driven horizontal tabs
  return (
    <section ref={containerRef} className="relative w-full" style={{ height: `${steps.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="mb-10 md:mb-14">
            <p className="text-eyebrow mb-3 text-[var(--color-ink)] opacity-60">HOW IT WORKS</p>
            <h2 className="text-display-lg">Three simple steps</h2>
          </div>

          <div className="flex flex-row gap-3 items-stretch min-h-[360px]">
            {steps.map((step, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;
              return (
                <div key={step.number} className="rounded-[20px] overflow-hidden relative" style={{
                  backgroundColor: isActive ? step.color : "var(--color-surface-soft)",
                  flex: isActive ? 4 : 1,
                  opacity: isPast ? 0.55 : 1,
                  transition: "flex 0.8s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                  willChange: "flex",
                }}>
                  {/* Collapsed label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-3 py-6" style={{
                    opacity: isActive ? 0 : 0.7,
                    transition: "opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    pointerEvents: isActive ? "none" : "auto",
                  }}>
                    <span className="text-caption mb-4 opacity-50">{step.number}</span>
                    <h3 className="text-headline text-center whitespace-nowrap" style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
                      {step.title}
                    </h3>
                  </div>

                  {/* Expanded content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8" style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(16px)",
                    transition: isActive
                      ? "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.35s"
                      : "opacity 0.25s ease 0s, transform 0.25s ease 0s",
                    pointerEvents: isActive ? "auto" : "none",
                  }}>
                    <div>
                      <span className="text-caption opacity-50 mb-3 block">{step.number}</span>
                      <h3 className="text-headline mb-4">{step.title}</h3>
                      <p className="text-body-lg max-w-lg mb-6">{step.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {step.details.map((detail, i) => (
                        <span key={detail} className="inline-flex items-center px-4 py-2 rounded-full bg-black/8 text-body-sm" style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? "translateY(0)" : "translateY(8px)",
                          transition: isActive
                            ? `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.45 + i * 0.06}s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.45 + i * 0.06}s`
                            : "opacity 0.2s ease 0s, transform 0.2s ease 0s",
                        }}>{detail}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-8 flex items-center gap-2">
            {steps.map((_, index) => (
              <div key={index} className="h-1 rounded-full" style={{
                flex: index === activeIndex ? 3 : 1,
                backgroundColor: index <= activeIndex ? "var(--color-ink)" : "var(--color-hairline)",
                transition: "flex 0.7s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.5s ease",
              }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
