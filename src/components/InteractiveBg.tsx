"use client";

import { useEffect, useRef } from "react";

export default function InteractiveBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Alphanumeric characters and programming language symbols
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]();+-=*/&|^%$#@!?<>_~:\\\"";
    const fontSize = 14;
    const cellWidth = 24;
    const cellHeight = 24;

    interface GridCell {
      char: string;
      x: number;
      y: number;
    }

    let grid: GridCell[] = [];

    // Initialize grid cells
    const initGrid = () => {
      grid = [];
      const cols = Math.ceil(canvas.width / cellWidth);
      const rows = Math.ceil(canvas.height / cellHeight);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          grid.push({
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            x: c * cellWidth + cellWidth / 2,
            y: r * cellHeight + cellHeight / 2,
          });
        }
      }
    };
    initGrid();

    // Reinitialize grid on resize
    const handleResize = () => {
      resizeCanvas();
      initGrid();
    };
    window.removeEventListener("resize", resizeCanvas);
    window.addEventListener("resize", handleResize);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      // Clear with dark background
      ctx.fillStyle = "#05050a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fontSize}px monospace`;

      grid.forEach((cell) => {
        // Subtle flickering changes to characters over time
        if (Math.random() < 0.0003) {
          cell.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        // Calculate distance to cursor
        const dx = cell.x - mouseRef.current.x;
        const dy = cell.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Hover proximity check
        if (distance < 160) {
          const ratio = (160 - distance) / 160; // 0 to 1
          
          // Brighten up the character near the cursor (pure monochrome highlight)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + ratio * 0.72})`;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        }
        ctx.shadowBlur = 0;

        // Draw character
        ctx.fillText(cell.char, cell.x, cell.y);
      });
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05050a]">
      {/* Canvas for static programming symbols grid */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-[0.95]" />

      {/* Radial overlay to make edges dark and center slightly bright */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#05050a_100%)] opacity-[0.8]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
      />
    </div>
  );
}
