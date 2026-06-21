"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [hoverState, setHoverState] = useState<"none" | "hover" | "view" | "live" | "copy">("none");
  const [isHidden, setIsHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const requestRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect mobile/touch devices
    const checkDevice = () => {
      const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const onMouseLeave = () => {
      setIsHidden(true);
    };

    const onMouseEnter = () => {
      setIsHidden(false);
    };

    // Listen to mouse events
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Track hover targets
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const clickable = target.closest("a, button, input, select, textarea, [role='button']");
      const cursorData = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorData === "view") {
        setHoverState("view");
      } else if (cursorData === "live") {
        setHoverState("live");
      } else if (cursorData === "copy") {
        setHoverState("copy");
      } else if (clickable) {
        setHoverState("hover");
      } else {
        setHoverState("none");
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    // Animation loop for custom cursor trail (inertia)
    const animateTrail = () => {
      const dx = mouseRef.current.x - trailRef.current.x;
      const dy = mouseRef.current.y - trailRef.current.y;
      
      // Interpolate trail position
      trailRef.current.x += dx * 0.15;
      trailRef.current.y += dy * 0.15;

      setTrail({ x: trailRef.current.x, y: trailRef.current.y });
      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  if (isMobile || isHidden) return null;

  const cursorSize = hoverState === "none" ? "w-3 h-3" : "w-16 h-16";
  const trailTranslate = `translate3d(${trail.x - (hoverState === "none" ? 12 : 32)}px, ${trail.y - (hoverState === "none" ? 12 : 32)}px, 0)`;
  const dotTranslate = `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`;

  return (
    <>
      {/* Lagging outer cursor */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-all duration-300 ease-out border flex items-center justify-center font-display text-[9px] font-bold tracking-widest uppercase ${
          hoverState === "none"
            ? "w-6 h-6 border-cyan-500/40 bg-transparent"
            : hoverState === "hover"
            ? "w-16 h-16 border-cyan-400 bg-cyan-500/10 scale-110 backdrop-blur-[2px]"
            : hoverState === "view"
            ? "w-20 h-20 border-cyan-400 bg-cyan-500/10 text-cyan-300 scale-120 backdrop-blur-[2px]"
            : hoverState === "live"
            ? "w-20 h-20 border-cyan-400 bg-cyan-500/10 text-cyan-300 scale-120 backdrop-blur-[2px]"
            : "w-20 h-20 border-cyan-400 bg-cyan-500/10 text-cyan-300 scale-120 backdrop-blur-[2px]"
        }`}
        style={{
          transform: trailTranslate,
        }}
      >
        {hoverState === "view" && "VIEW"}
        {hoverState === "live" && "LIVE"}
        {hoverState === "copy" && "COPY"}
      </div>

      {/* Static inner dot */}
      <div
        className={`fixed top-0 left-0 w-2 h-2 pointer-events-none z-50 rounded-full bg-cyan-400 mix-blend-screen transition-transform duration-100 ${
          hoverState !== "none" ? "scale-[0.5]" : ""
        }`}
        style={{
          transform: dotTranslate,
        }}
      />
    </>
  );
}
