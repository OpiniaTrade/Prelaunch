"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxText({
  children,
  speed = 0.3,
  className = "",
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = elementCenter - viewportCenter;

        // Parallax offset
        setOffset(distance * speed);

        // Opacity: full at center, fades as element moves away from center
        // Normalized distance: 0 at center, 1 at edge of viewport
        const normalizedDistance =
          Math.abs(distance) / (viewportHeight / 2);
        // Clamp opacity between 0.1 and 1
        const newOpacity = Math.max(0.1, 1 - normalizedDistance * 0.8);
        setOpacity(newOpacity);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        opacity,
        transition: "opacity 0.1s linear",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
