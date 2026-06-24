"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Expression = "neutral" | "wishful" | "excited" | "confused" | "scared" | "angry" | "sad" | "crying" | "jumping";

export default function RopeCharacter() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [ropeDropped, setRopeDropped] = useState(false);
  const [characterVisible, setCharacterVisible] = useState(false);
  const [chainOffset, setChainOffset] = useState(0);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [expression, setExpression] = useState<Expression>("neutral");
  const [handPull, setHandPull] = useState(0); // ranges from -1 to 1, alternates
  const [bounceY, setBounceY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const mousePositions = useRef<{ x: number; y: number; t: number }[]>([]);
  const confusedTimeout = useRef<NodeJS.Timeout | null>(null);
  const scaredTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevScrollY = useRef(0);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const isDraggingRef = useRef(false);
  const handCycleRef = useRef(0);
  const handAnimFrame = useRef<number | null>(null);
  const scrollStopTimer = useRef<NodeJS.Timeout | null>(null);

  // Detect first scroll
  useEffect(() => {
    const handleFirstScroll = () => {
      if (!hasScrolled && window.scrollY > 5) {
        setHasScrolled(true);
        setTimeout(() => setRopeDropped(true), 100);
        setTimeout(() => setCharacterVisible(true), 700);
      }
    };
    window.addEventListener("scroll", handleFirstScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleFirstScroll);
  }, [hasScrolled]);

  // Detect button clicks — all creatures jump with joy
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a[href]") || target.closest("button");
      if (interactive) {
        setIsJumping(true);
        setExpression("jumping");
        setTimeout(() => {
          setIsJumping(false);
          setExpression("neutral");
        }, 1200);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Track scroll for chain movement
  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const delta = scrollY - prevScrollY.current;
        setChainOffset((prev) => (prev + delta * 0.5) % 24);
        setBounceY(Math.max(-4, Math.min(4, delta * 0.15)));

        // Mark as scrolling and reset stop timer
        setIsScrolling(true);
        if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current);
        scrollStopTimer.current = setTimeout(() => {
          setIsScrolling(false);
          setBounceY(0);
        }, 300);

        prevScrollY.current = scrollY;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(rafId); if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current); };
  }, []);

  // Constant hand animation loop — runs at fixed pace while scrolling (not dragging)
  useEffect(() => {
    const animate = () => {
      if (isScrolling && !isDragging) {
        handCycleRef.current += 0.08;
        setHandPull(Math.sin(handCycleRef.current));
      }
      handAnimFrame.current = requestAnimationFrame(animate);
    };

    handAnimFrame.current = requestAnimationFrame(animate);
    return () => {
      if (handAnimFrame.current) cancelAnimationFrame(handAnimFrame.current);
    };
  }, [isScrolling, isDragging]);

  // Reset hands when scrolling stops or dragging
  useEffect(() => {
    if (!isScrolling || isDragging) {
      setHandPull(0);
    }
  }, [isScrolling, isDragging]);

  // Rope drag — smooth like native scrollbar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      // Direct 1:1 pixel mapping — drag distance = scroll distance
      const deltaY = e.clientY - dragStartY.current;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = dragStartScroll.current + deltaY * 3;
      const clamped = Math.max(0, Math.min(maxScroll, targetScroll));

      // Use requestAnimationFrame for smooth rendering
      requestAnimationFrame(() => {
        window.scrollTo(0, clamped);
      });
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        document.documentElement.style.scrollBehavior = "";
        // Fade out drag expressions after release
        setTimeout(() => {
          setExpression("neutral");
        }, 1800);
      }
    };

    // passive: false is critical for preventDefault to work
    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScroll.current = window.scrollY;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    // Disable CSS smooth scroll so scrollTo is instant during drag
    document.documentElement.style.scrollBehavior = "auto";
    setExpression("angry");
  }, []);

  // Mouse tracking for expressions (only when not dragging)
  const checkConfused = useCallback(() => {
    const positions = mousePositions.current;
    if (positions.length < 10) return false;
    const recent = positions.slice(-10);
    let directionChanges = 0;
    let totalDistance = 0;
    for (let i = 1; i < recent.length; i++) {
      const dx = recent[i].x - recent[i - 1].x;
      const dy = recent[i].y - recent[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      if (i > 1) {
        const prevDx = recent[i - 1].x - recent[i - 2].x;
        const prevDy = recent[i - 1].y - recent[i - 2].y;
        if ((dx > 0 && prevDx < 0) || (dx < 0 && prevDx > 0) ||
            (dy > 0 && prevDy < 0) || (dy < 0 && prevDy > 0)) directionChanges++;
      }
    }
    const timeSpan = recent[recent.length - 1].t - recent[0].t;
    const speed = timeSpan > 0 ? totalDistance / timeSpan : 0;
    return speed > 1.8 && directionChanges >= 5;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      const { clientX, clientY } = e;
      const now = Date.now();
      mousePositions.current.push({ x: clientX, y: clientY, t: now });
      if (mousePositions.current.length > 25) mousePositions.current = mousePositions.current.slice(-25);

      const charX = 70; const charY = window.innerHeight - 100;
      const dx = clientX - charX; const dy = clientY - charY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      setEyeOffset({ x: distance > 0 ? (dx / distance) * 5 : 0, y: distance > 0 ? (dy / distance) * 5 : 0 });

      const target = e.target as HTMLElement;
      const interactive = target.closest("a[href]") || target.closest("button");
      const text = interactive?.textContent?.toLowerCase() || "";
      if (text.includes("waitlist") || text.includes("contact") || text.includes("early access")) { setExpression("excited"); return; }
      if (clientX > window.innerWidth * 0.65 && clientY < 80) { setExpression("wishful"); return; }
      if (clientX < 180 && clientY > window.innerHeight - 280) {
        setExpression("scared");
        if (scaredTimeout.current) clearTimeout(scaredTimeout.current);
        scaredTimeout.current = setTimeout(() => setExpression("neutral"), 1200);
        return;
      }
      if (checkConfused()) {
        setExpression("confused");
        if (confusedTimeout.current) clearTimeout(confusedTimeout.current);
        confusedTimeout.current = setTimeout(() => setExpression("neutral"), 2000);
        return;
      }
      if (expression !== "confused" && expression !== "scared") setExpression("neutral");
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [checkConfused, expression, isDragging]);

  if (!hasScrolled) return null;

  const companion1Expr: Expression = isJumping ? "jumping" : isDragging ? "sad" :
    expression === "excited" ? "excited" : expression === "scared" ? "confused" :
    expression === "confused" ? "scared" : expression === "wishful" ? "excited" : "wishful";
  const companion2Expr: Expression = isJumping ? "jumping" : isDragging ? "crying" :
    expression === "excited" ? "excited" : expression === "scared" ? "scared" :
    expression === "confused" ? "neutral" : expression === "wishful" ? "excited" : "excited";

  return (
    <div className="fixed left-4 md:left-8 top-0 bottom-0 z-40 pointer-events-none">
      {/* Chain — draggable hit area */}
      <div
        className="absolute left-[48px] top-0 bottom-[190px] overflow-hidden pointer-events-auto"
        style={{
          width: 28, opacity: ropeDropped ? 1 : 0,
          transform: ropeDropped ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top center",
          transition: "transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleDragStart}
      >
        <div style={{
          position: "absolute", top: 0, left: 9, width: 10,
          height: "calc(100% + 48px)",
          transform: `translateY(${chainOffset}px)`, transition: "transform 0.05s linear",
        }}>
          <ChainLinks />
        </div>
      </div>

      {/* Main puller */}
      <div className="absolute left-0 bottom-0" style={{
        transform: characterVisible
          ? `translateY(${isJumping ? -20 + bounceY : 16 + bounceY}px)`
          : "translateY(240px)",
        transition: characterVisible
          ? "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)"
          : "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div className="relative">
          <div className="absolute" style={{ width: 18, height: 28, backgroundColor: "#2a2755", left: 40, top: -18, borderRadius: "6px 6px 8px 8px", transform: `translateY(${handPull * 12}px) rotate(${-6 + handPull * 4}deg)`, transition: "transform 0.12s ease-out", boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.2)" }}>
            <div className="absolute bottom-0 left-[2px] flex gap-[2px]" style={{ transform: "translateY(4px)" }}>
              <div className="w-[4px] h-[7px] bg-[#3d3766] rounded-b-full" />
              <div className="w-[4px] h-[8px] bg-[#3d3766] rounded-b-full" />
              <div className="w-[4px] h-[7px] bg-[#3d3766] rounded-b-full" />
            </div>
          </div>
          <div className="absolute" style={{ width: 18, height: 28, backgroundColor: "#2a2755", left: 64, top: -18, borderRadius: "6px 6px 8px 8px", transform: `translateY(${handPull * -12}px) rotate(${6 + handPull * -4}deg)`, transition: "transform 0.12s ease-out", boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.2)" }}>
            <div className="absolute bottom-0 left-[2px] flex gap-[2px]" style={{ transform: "translateY(4px)" }}>
              <div className="w-[4px] h-[7px] bg-[#3d3766] rounded-b-full" />
              <div className="w-[4px] h-[8px] bg-[#3d3766] rounded-b-full" />
              <div className="w-[4px] h-[7px] bg-[#3d3766] rounded-b-full" />
            </div>
          </div>
          <CreatureBody width={124} height={200} expression={isDragging ? "angry" : expression} eyeOffset={eyeOffset} color="#1f1d3d" borderRadius={28} browStyle="thick" />
        </div>
      </div>

      {/* Companion 1 — plum */}
      <div className="absolute left-[115px] bottom-0" style={{
        transform: characterVisible
          ? `translateY(${isJumping ? -15 : 20}px)`
          : "translateY(200px)",
        transition: characterVisible ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: characterVisible && !isJumping ? "0.2s" : "0.05s",
      }}>
        <CreatureBody width={94} height={160} expression={companion1Expr} eyeOffset={eyeOffset} color="#5c3d5e" borderRadius={24} browStyle="thin" />
      </div>

      {/* Companion 2 — teal (the little one) */}
      <div className="absolute left-[80px] bottom-0" style={{
        transform: characterVisible
          ? `translateY(${isJumping ? -25 : 50}px)`
          : "translateY(180px)",
        transition: characterVisible ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: characterVisible && !isJumping ? "0.4s" : "0.1s",
      }}>
        <CreatureBody width={72} height={120} expression={companion2Expr} eyeOffset={eyeOffset} color="#2d4a4a" borderRadius={20} browStyle="angular" />
      </div>

      {/* Sparkles when jumping */}
      {isJumping && (
        <div className="absolute left-0 bottom-[50px] w-[200px] h-[250px] pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute" style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${10 + Math.random() * 60}%`,
              width: 6 + Math.random() * 6,
              height: 6 + Math.random() * 6,
              borderRadius: "50%",
              backgroundColor: ["#ff3d8b", "#dceeb1", "#c5b0f4", "#f4ecd6", "#c8e6cd", "#f3c9b6"][i % 6],
              animation: `sparkle ${0.6 + Math.random() * 0.6}s ease-out forwards`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Creature Body ─── */
type BrowStyle = "thick" | "thin" | "angular";

function CreatureBody({ width, height, expression, eyeOffset, color, borderRadius, browStyle }: {
  width: number; height: number; expression: Expression;
  eyeOffset: { x: number; y: number }; color: string; borderRadius: number; browStyle: BrowStyle;
}) {
  const scale = width / 124;
  return (
    <div className="relative overflow-hidden" style={{
      width, height, borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
      backgroundColor: color,
      boxShadow: "0 -4px 20px rgba(31,29,61,0.35), inset 0 2px 6px rgba(255,255,255,0.05)",
    }}>
      <div className="absolute top-0 left-0 right-0 h-[40%]" style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
        borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
      }} />
      <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: height * 0.25 }}>
        <div className="flex mb-[3px]" style={{ gap: Math.round(14 * scale) }}>
          <Eyebrow expression={expression} side="left" scale={scale} browStyle={browStyle} />
          <Eyebrow expression={expression} side="right" scale={scale} browStyle={browStyle} />
        </div>
        <div className="flex" style={{ gap: Math.round(12 * scale) }}>
          <Eye offsetX={eyeOffset.x} offsetY={eyeOffset.y} expression={expression} side="left" scale={scale} />
          <Eye offsetX={eyeOffset.x} offsetY={eyeOffset.y} expression={expression} side="right" scale={scale} />
        </div>
        <Mouth expression={expression} scale={scale} />
      </div>
      {/* Blush (excited) */}
      {(expression === "excited" || expression === "jumping") && (<>
        <div className="absolute rounded-full" style={{ width: Math.round(14*scale), height: Math.round(8*scale), backgroundColor: "#ff3d8b", opacity: expression === "jumping" ? 0.5 : 0.3, left: Math.round(10*scale), top: height * 0.55 }} />
        <div className="absolute rounded-full" style={{ width: Math.round(14*scale), height: Math.round(8*scale), backgroundColor: "#ff3d8b", opacity: expression === "jumping" ? 0.5 : 0.3, right: Math.round(10*scale), top: height * 0.55 }} />
      </>)}
      {/* Sweat (scared) */}
      {expression === "scared" && (
        <div className="absolute" style={{ width: Math.round(7*scale), height: Math.round(12*scale), right: Math.round(10*scale), top: height * 0.18, borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%", backgroundColor: "rgba(197,176,244,0.5)", animation: "sweatDrop 0.8s ease-in-out infinite" }} />
      )}
      {/* Anger vein (angry) */}
      {expression === "angry" && (
        <svg className="absolute" style={{ width: Math.round(16*scale), height: Math.round(16*scale), right: Math.round(6*scale), top: height * 0.12 }} viewBox="0 0 16 16">
          <path d="M8,2 L8,8 M5,5 L11,5 M4,8 L8,8 M8,8 L12,8" stroke="#d32f2f" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>
      )}
      {/* Tear streams (crying) — coming from just below the eyes */}
      {expression === "crying" && (<>
        <div className="absolute" style={{ width: Math.round(3*scale), height: Math.round(20*scale), left: width * 0.3, top: height * 0.38, background: "linear-gradient(180deg, rgba(100,180,255,0.8) 0%, rgba(100,180,255,0) 100%)", borderRadius: 4, animation: "tearFall 1s ease-in infinite" }} />
        <div className="absolute" style={{ width: Math.round(3*scale), height: Math.round(20*scale), right: width * 0.3, top: height * 0.38, background: "linear-gradient(180deg, rgba(100,180,255,0.8) 0%, rgba(100,180,255,0) 100%)", borderRadius: 4, animation: "tearFall 1s ease-in infinite 0.35s" }} />
      </>)}
      {/* Sad shadow under eyes */}
      {expression === "sad" && (<>
        <div className="absolute rounded-full" style={{ width: Math.round(10*scale), height: Math.round(4*scale), backgroundColor: "rgba(0,0,0,0.15)", left: width * 0.25, top: height * 0.48 }} />
        <div className="absolute rounded-full" style={{ width: Math.round(10*scale), height: Math.round(4*scale), backgroundColor: "rgba(0,0,0,0.15)", right: width * 0.25, top: height * 0.48 }} />
      </>)}
    </div>
  );
}

/* ─── Chain Links ─── */
function ChainLinks() {
  const links = Array.from({ length: 80 });
  return (
    <svg width="10" height={links.length * 24} viewBox={`0 0 10 ${links.length * 24}`} className="w-full">
      {links.map((_, i) => {
        const y = i * 24; const isEven = i % 2 === 0;
        return (<g key={i}>
          <rect x={isEven ? 1 : 2} y={y + 2} width={isEven ? 8 : 6} height={20} rx={3} ry={3} fill="none" stroke={isEven ? "#c5b0f4" : "#1f1d3d"} strokeWidth={2} />
          <rect x={isEven ? 2.5 : 3.5} y={y + 5} width={isEven ? 5 : 3} height={14} rx={2} ry={2} fill="none" stroke={isEven ? "rgba(255,255,255,0.2)" : "rgba(197,176,244,0.15)"} strokeWidth={0.5} />
        </g>);
      })}
    </svg>
  );
}

/* ─── Eyebrow ─── */
function Eyebrow({ expression, side, scale, browStyle }: {
  expression: Expression; side: "left" | "right"; scale: number; browStyle: BrowStyle;
}) {
  let rotation = 0; let translateY = 0;
  let width = Math.round(14 * scale);
  let height = Math.max(2, Math.round(3 * scale));
  let color = "#c5b0f4"; let borderRadius = "2px"; let scaleX = 1;

  switch (browStyle) {
    case "thick": height = Math.max(3, Math.round(4 * scale)); borderRadius = "3px"; break;
    case "thin": height = Math.max(2, Math.round(2.5 * scale)); width = Math.round(16 * scale); borderRadius = "1px"; break;
    case "angular": height = Math.max(2, Math.round(3 * scale)); borderRadius = "1px 4px 1px 1px"; break;
  }

  switch (expression) {
    case "excited":
      if (browStyle === "thick") { rotation = side === "left" ? -15 : 15; translateY = -5*scale; color = "#dceeb1"; scaleX = 1.1; }
      else if (browStyle === "thin") { rotation = side === "left" ? -8 : 8; translateY = -6*scale; color = "#f4ecd6"; width = Math.round(18*scale); }
      else { rotation = side === "left" ? -20 : 20; translateY = -4*scale; color = "#c8e6cd"; scaleX = 1.2; }
      break;
    case "wishful":
      if (browStyle === "thick") { rotation = side === "left" ? 10 : -10; translateY = -1*scale; }
      else if (browStyle === "thin") { rotation = side === "left" ? 5 : -5; translateY = -2*scale; color = "#efd4d4"; scaleX = 0.9; }
      else { rotation = side === "left" ? 12 : -12; color = "#dceeb1"; }
      break;
    case "confused":
      if (browStyle === "thick") { rotation = side === "left" ? -25 : 18; translateY = (side === "left" ? -3 : 2)*scale; color = "#f3c9b6"; }
      else if (browStyle === "thin") { rotation = side === "left" ? 20 : -30; translateY = (side === "left" ? 1 : -4)*scale; scaleX = side === "left" ? 0.7 : 1.2; }
      else { rotation = side === "left" ? -10 : 35; translateY = (side === "left" ? -1 : 3)*scale; color = "#f4ecd6"; }
      break;
    case "scared":
      if (browStyle === "thick") { rotation = side === "left" ? 18 : -18; translateY = -6*scale; width = Math.round(12*scale); color = "#efd4d4"; scaleX = 1.15; }
      else if (browStyle === "thin") { rotation = side === "left" ? 25 : -25; translateY = -7*scale; color = "#efd4d4"; }
      else { rotation = side === "left" ? 15 : -15; translateY = -8*scale; color = "#f3c9b6"; scaleX = 0.8; }
      break;

    case "angry":
      // Furrowed, V-shaped, pointing inward-down aggressively
      if (browStyle === "thick") { rotation = side === "left" ? -35 : 35; translateY = 1*scale; color = "#d32f2f"; scaleX = 1.3; width = Math.round(16*scale); height = Math.max(4, Math.round(5*scale)); }
      else if (browStyle === "thin") { rotation = side === "left" ? -28 : 28; translateY = 0; color = "#ff3d8b"; width = Math.round(17*scale); scaleX = 1.1; }
      else { rotation = side === "left" ? -40 : 40; translateY = 2*scale; color = "#d32f2f"; scaleX = 1.2; height = Math.max(3, Math.round(4*scale)); }
      break;
    case "sad":
      // Inner edges point up, outer edges droop down — classic sad brows
      if (browStyle === "thick") { rotation = side === "left" ? 22 : -22; translateY = 1*scale; color = "#8B7355"; scaleX = 0.85; width = Math.round(13*scale); }
      else if (browStyle === "thin") { rotation = side === "left" ? 18 : -18; translateY = 2*scale; color = "#9B8B75"; scaleX = 0.8; width = Math.round(14*scale); }
      else { rotation = side === "left" ? 20 : -20; translateY = 1*scale; color = "#8B7355"; scaleX = 0.9; }
      break;
    case "crying":
      // Deeply arched upward in center — distressed, higher inner angle
      if (browStyle === "thick") { rotation = side === "left" ? 28 : -28; translateY = -2*scale; color = "#5a9fcc"; scaleX = 0.8; width = Math.round(12*scale); height = Math.max(3, Math.round(4*scale)); }
      else if (browStyle === "thin") { rotation = side === "left" ? 24 : -24; translateY = -1*scale; color = "#5a9fcc"; width = Math.round(13*scale); scaleX = 0.75; }
      else { rotation = side === "left" ? 30 : -30; translateY = -2*scale; color = "#5a9fcc"; scaleX = 0.7; height = Math.max(3, Math.round(4*scale)); }
      break;
    case "jumping":
      // High raised, joyful — like excited but even more lifted
      if (browStyle === "thick") { rotation = side === "left" ? -18 : 18; translateY = -7*scale; color = "#ff3d8b"; scaleX = 1.2; width = Math.round(16*scale); }
      else if (browStyle === "thin") { rotation = side === "left" ? -12 : 12; translateY = -8*scale; color = "#dceeb1"; width = Math.round(18*scale); scaleX = 1.1; }
      else { rotation = side === "left" ? -22 : 22; translateY = -6*scale; color = "#ff3d8b"; scaleX = 1.3; }
      break;
    case "neutral": default:
      if (browStyle === "thin") { rotation = side === "left" ? -2 : 2; }
      else if (browStyle === "angular") { rotation = side === "left" ? -3 : 3; color = "#c8e6cd"; }
      break;
  }

  return (<div style={{ width, height, backgroundColor: color, borderRadius, transform: `rotate(${rotation}deg) translateY(${translateY}px) scaleX(${scaleX})`, transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }} />);
}

/* ─── Eye ─── */
function Eye({ offsetX, offsetY, expression, side, scale }: {
  offsetX: number; offsetY: number; expression: Expression; side: "left" | "right"; scale: number;
}) {
  let eyeSize = Math.round(15 * scale);
  let pupilSize = Math.round(6 * scale);
  let hasSparkle = false;
  let pupilMult = 0.7;
  let eyeHeightRatio = 1;

  switch (expression) {
    case "excited": eyeSize = Math.round(17*scale); pupilSize = Math.round(7*scale); hasSparkle = true; break;
    case "wishful": eyeHeightRatio = 0.72; pupilSize = Math.round(5*scale); break;
    case "confused":
      if (side === "left") eyeSize = Math.round(17*scale);
      else { eyeSize = Math.round(12*scale); pupilSize = Math.round(5*scale); }
      break;
    case "scared": eyeSize = Math.round(19*scale); pupilSize = Math.round(4*scale); pupilMult = 1.2; break;
    case "angry":
      // Narrow, glaring slits
      eyeSize = Math.round(16*scale); eyeHeightRatio = 0.5; pupilSize = Math.round(6*scale); pupilMult = 0.3;
      break;
    case "sad":
      // Slightly drooped, looking down
      eyeSize = Math.round(14*scale); eyeHeightRatio = 0.75; pupilSize = Math.round(6*scale); pupilMult = 0.3;
      break;
    case "crying":
      // Wide, watery, glistening
      eyeSize = Math.round(17*scale); pupilSize = Math.round(8*scale); eyeHeightRatio = 0.9; hasSparkle = true;
      break;
    case "jumping":
      // Extra wide, super sparkly
      eyeSize = Math.round(19*scale); pupilSize = Math.round(6*scale); hasSparkle = true;
      break;
  }

  return (
    <div className="relative rounded-full bg-white flex items-center justify-center overflow-hidden" style={{
      width: eyeSize, height: Math.round(eyeSize * eyeHeightRatio),
      boxShadow: expression === "crying" ? "inset 0 -2px 4px rgba(100,180,255,0.3), inset 0 1px 3px rgba(0,0,0,0.1)" : "inset 0 1px 3px rgba(0,0,0,0.1)",
      transition: "width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    }}>
      <div className="absolute rounded-full bg-[#1f1d3d]" style={{
        width: pupilSize, height: pupilSize,
        transform: `translate(${offsetX * pupilMult}px, ${(expression === "sad" ? 2 : offsetY * pupilMult)}px)`,
        transition: "transform 0.06s linear, width 0.3s ease, height 0.3s ease",
      }} />
      {hasSparkle && (
        <div className="absolute rounded-full bg-white" style={{ width: Math.max(2, Math.round(3*scale)), height: Math.max(2, Math.round(3*scale)), top: 2, right: 2, opacity: 0.9 }} />
      )}
    </div>
  );
}

/* ─── Mouth ─── */
function Mouth({ expression, scale }: { expression: Expression; scale: number }) {
  const s = scale;
  switch (expression) {
    case "excited":
      return (<div style={{ marginTop: Math.round(6*s) }}>
        <div style={{ width: Math.round(20*s), height: Math.round(11*s), borderRadius: `0 0 ${Math.round(11*s)}px ${Math.round(11*s)}px`, backgroundColor: "#ff3d8b", boxShadow: "inset 0 -2px 3px rgba(0,0,0,0.15)" }} />
      </div>);
    case "wishful":
      return (<div style={{ marginTop: Math.round(6*s) }}>
        <svg width={Math.round(14*s)} height={Math.round(8*s)} viewBox="0 0 14 8">
          <path d="M2,6 Q7,2 12,6" fill="none" stroke="#c5b0f4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>);
    case "confused":
      return (<div style={{ marginTop: Math.round(6*s) }}>
        <svg width={Math.round(18*s)} height={Math.round(10*s)} viewBox="0 0 18 10">
          <path d="M2,5 Q5,2 9,6 Q13,10 16,4" fill="none" stroke="#c5b0f4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>);
    case "scared":
      return (<div style={{ marginTop: Math.round(5*s) }}>
        <svg width={Math.round(16*s)} height={Math.round(12*s)} viewBox="0 0 16 12">
          <path d="M4,3 Q8,11 12,3" fill="none" stroke="#efd4d4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>);
    case "angry":
      // Tight grimace — teeth showing, aggressive
      return (<div style={{ marginTop: Math.round(5*s) }}>
        <svg width={Math.round(22*s)} height={Math.round(12*s)} viewBox="0 0 22 12">
          <rect x="3" y="3" width="16" height="7" rx="2" fill="#2a1010" />
          <line x1="7" y1="3" x2="7" y2="10" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="11" y1="3" x2="11" y2="10" stroke="white" strokeWidth="1" opacity="0.6" />
          <line x1="15" y1="3" x2="15" y2="10" stroke="white" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>);
    case "sad":
      // Downturned frown
      return (<div style={{ marginTop: Math.round(7*s) }}>
        <svg width={Math.round(16*s)} height={Math.round(10*s)} viewBox="0 0 16 10">
          <path d="M3,3 Q8,10 13,3" fill="none" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>);
    case "crying":
      // Wobbly open wail
      return (<div style={{ marginTop: Math.round(5*s) }}>
        <svg width={Math.round(20*s)} height={Math.round(14*s)} viewBox="0 0 20 14">
          <ellipse cx="10" cy="8" rx="6" ry="5" fill="#2a3a4a" />
          <path d="M5,6 Q10,3 15,6" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>);
    case "jumping":
      // Big open smile, D-shape
      return (<div style={{ marginTop: Math.round(5*s) }}>
        <div style={{ width: Math.round(24*s), height: Math.round(14*s), borderRadius: `0 0 ${Math.round(14*s)}px ${Math.round(14*s)}px`, backgroundColor: "#ff3d8b", boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.2)", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ width: "60%", height: "40%", backgroundColor: "#d4265f", borderRadius: `${Math.round(8*s)}px ${Math.round(8*s)}px 0 0` }} />
        </div>
      </div>);
    case "neutral": default:
      return (<div style={{ marginTop: Math.round(6*s) }}>
        <svg width={Math.round(12*s)} height={Math.round(6*s)} viewBox="0 0 12 6">
          <path d="M2,2 Q6,5 10,2" fill="none" stroke="#c5b0f4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>);
  }
}
