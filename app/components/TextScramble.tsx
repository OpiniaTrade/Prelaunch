"use client";

import { useEffect, useRef, useState } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnView?: boolean;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function TextScramble({
  text,
  className = "",
  triggerOnView = true,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!triggerOnView) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          scramble();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAnimated, triggerOnView]);

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration += 1 / 2;

      if (iteration >= text.length) {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, 30);
  };

  return (
    <span ref={ref} className={className} data-interactive>
      {displayed}
    </span>
  );
}
