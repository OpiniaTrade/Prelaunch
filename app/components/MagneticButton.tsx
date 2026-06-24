"use client";

import { useRef, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState("translate(0, 0)");

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(`translate(${x * 0.3}px, ${y * 0.3}px)`);
  };

  const handleMouseLeave = () => {
    setTransform("translate(0, 0)");
  };

  return (
    <a
      ref={ref}
      href={href || "#"}
      data-interactive
      className={className}
      style={{
        transform,
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "inline-flex",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}
