"use client";

import { useRef, useState } from "react";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function InteractiveCard({
  children,
  className = "",
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * 12;
    const rotateY = (x - 0.5) * 12;

    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(800px) rotateX(0) rotateY(0) scale(1)",
      transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-interactive
    >
      {children}
    </div>
  );
}
