"use client";

import { useEffect, useRef, useState } from "react";

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "blur-in";

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  className?: string;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
  threshold = 0.15,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // Scroll-based opacity: gentle fade only when nearly off-screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;

        // Distance from center normalized to 0-1
        const normalizedDistance =
          Math.abs(elementCenter - viewportCenter) / (viewportHeight / 2);

        // Opacity: 1 when anywhere in the central 85%, gentle fade only at edges
        const fadeStart = 0.85;
        let opacity = 1;
        if (normalizedDistance > fadeStart) {
          // Gentle quadratic fade — never drops below 0.3
          const fadeProgress = (normalizedDistance - fadeStart) / (1 - fadeStart);
          opacity = Math.max(0.3, 1 - fadeProgress * 0.7);
        }

        setScrollOpacity(opacity);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const baseStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: "0.8s",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
  };

  const hiddenStyles: Record<AnimationVariant, React.CSSProperties> = {
    "fade-up": { opacity: 0, transform: "translateY(40px)" },
    "fade-down": { opacity: 0, transform: "translateY(-40px)" },
    "fade-left": { opacity: 0, transform: "translateX(-40px)" },
    "fade-right": { opacity: 0, transform: "translateX(40px)" },
    "scale-up": { opacity: 0, transform: "scale(0.92)" },
    "blur-in": { opacity: 0, filter: "blur(10px)" },
  };

  const visibleStyles: React.CSSProperties = {
    opacity: scrollOpacity,
    transform: "translate(0) scale(1)",
    filter: "blur(0px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...baseStyles,
        ...(isVisible ? visibleStyles : hiddenStyles[variant]),
      }}
    >
      {children}
    </div>
  );
}
