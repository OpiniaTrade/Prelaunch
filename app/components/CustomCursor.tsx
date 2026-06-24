"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      // Check if grabbing the rope (body cursor is set to grabbing)
      if (document.body.style.cursor === "grabbing") {
        setIsGrabbing(true);
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      setIsGrabbing(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-interactive]")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Watch for body cursor changes (rope drag sets it)
    const checkGrabState = () => {
      const bodyGrabbing = document.body.style.cursor === "grabbing";
      setIsGrabbing(bodyGrabbing);
    };

    const animate = () => {
      trailPos.current.x += (pos.current.x - trailPos.current.x) * 0.15;
      trailPos.current.y += (pos.current.y - trailPos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px)`;
      }

      checkGrabState();
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Determine cursor appearance
  const getSize = () => {
    if (isGrabbing) return 28;
    if (isHovering) return 48;
    return 10;
  };

  const size = getSize();
  const margin = -(size / 2);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: size,
          height: size,
          marginLeft: margin,
          marginTop: margin,
          borderRadius: isGrabbing ? "6px" : "50%",
          backgroundColor: isGrabbing
            ? "transparent"
            : isClicking
              ? "var(--color-accent-magenta)"
              : "#fff",
          border: isGrabbing ? "2px solid #fff" : "none",
          transition:
            "width 0.3s cubic-bezier(0.22, 1, 0.36, 1), height 0.3s cubic-bezier(0.22, 1, 0.36, 1), margin 0.3s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.15s ease, border-radius 0.2s ease",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Grab icon — fist/grip shape */}
        {isGrabbing && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ opacity: 0.9 }}
          >
            <rect x="3" y="6" width="3" height="7" rx="1.5" fill="#fff" />
            <rect x="6.5" y="4" width="3" height="9" rx="1.5" fill="#fff" />
            <rect x="10" y="5" width="3" height="8" rx="1.5" fill="#fff" />
            <rect x="5" y="10" width="8" height="4" rx="2" fill="#fff" opacity="0.6" />
          </svg>
        )}
      </div>
      {/* Trail ring */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference"
        style={{
          width: isGrabbing ? 40 : isHovering ? 64 : 36,
          height: isGrabbing ? 40 : isHovering ? 64 : 36,
          marginLeft: isGrabbing ? -20 : isHovering ? -32 : -18,
          marginTop: isGrabbing ? -20 : isHovering ? -32 : -18,
          borderRadius: isGrabbing ? "8px" : "50%",
          border: isGrabbing
            ? "1.5px dashed rgba(255,255,255,0.6)"
            : "1.5px solid rgba(255,255,255,0.5)",
          transition:
            "width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1), margin 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.2s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
