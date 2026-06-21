"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Gamepad2 } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";

const TECH_TAGS = [
  "React", "Next.js", "TypeScript", "Node.js", "Express", 
  "MongoDB", "SQL", "Tailwind", "CSS", "GSAP", 
  "Framer Motion", "Figma", "Redux", "Git", "REST APIs", "MERN Stack"
];

interface PhysicsBody {
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  radius: number; // For collision approximation
  mass: number;
  isGrabbed: boolean;
}

const drawLogo = (ctx: CanvasRenderingContext2D, label: string, x: number, y: number, size: number) => {
  ctx.save();
  switch (label) {
    case "REACT": {
      ctx.strokeStyle = "#00d8ff";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y, size / 2, size / 6, (i * Math.PI) / 3, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.fillStyle = "#00d8ff";
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case "NEXT.JS": {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - size / 4, y + size / 4);
      ctx.lineTo(x - size / 4, y - size / 4);
      ctx.lineTo(x + size / 6, y + size / 6);
      ctx.lineTo(x + size / 6, y - size / 4);
      ctx.stroke();
      break;
    }
    case "TYPESCRIPT": {
      ctx.fillStyle = "#3178c6";
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 5px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TS", x, y + 0.5);
      break;
    }
    case "NODE.JS": {
      ctx.fillStyle = "#339933";
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        ctx.lineTo(x + (size / 2) * Math.cos(angle), y + (size / 2) * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "EXPRESS": {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 6px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ex", x, y - 0.5);
      break;
    }
    case "MONGODB": {
      ctx.fillStyle = "#13aa52";
      ctx.beginPath();
      ctx.ellipse(x, y, size / 5, size / 2, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#3fa037";
      ctx.beginPath();
      ctx.ellipse(x, y, size / 10, size / 3, -Math.PI / 6, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case "SQL": {
      ctx.strokeStyle = "#00e5ff";
      ctx.fillStyle = "rgba(0, 229, 255, 0.2)";
      ctx.lineWidth = 0.8;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(x, y + i * 2.2, size / 2, size / 6, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }
    case "TAILWIND": {
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(x - size / 2, y);
      ctx.bezierCurveTo(x - size / 4, y - size / 3, x, y - size / 3, x + size / 4, y);
      ctx.bezierCurveTo(x, y + size / 3, x - size / 4, y + size / 3, x - size / 2, y);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.bezierCurveTo(x + size / 4, y + size / 3, x, y + size / 3, x - size / 4, y);
      ctx.bezierCurveTo(x, y - size / 3, x + size / 4, y - size / 3, x + size / 2, y);
      ctx.fill();
      break;
    }
    case "CSS": {
      ctx.fillStyle = "#1572b6";
      ctx.beginPath();
      ctx.moveTo(x - size / 2.5, y - size / 2);
      ctx.lineTo(x + size / 2.5, y - size / 2);
      ctx.lineTo(x + size / 3, y + size / 3);
      ctx.lineTo(x, y + size / 2);
      ctx.lineTo(x - size / 3, y + size / 3);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "GSAP": {
      ctx.fillStyle = "#88ce02";
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 5px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("G", x, y);
      break;
    }
    case "FRAMER MOTION": {
      ctx.fillStyle = "#f107a3";
      ctx.beginPath();
      ctx.moveTo(x - size / 2, y - size / 2);
      ctx.lineTo(x + size / 2, y - size / 2);
      ctx.lineTo(x, y);
      ctx.lineTo(x - size / 2, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "FIGMA": {
      const r = size / 3.8;
      ctx.fillStyle = "#f24e1e";
      ctx.beginPath(); ctx.arc(x - r / 2, y - r, r, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#a259ff";
      ctx.beginPath(); ctx.arc(x - r / 2, y, r, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#0acf83";
      ctx.beginPath(); ctx.arc(x - r / 2, y + r, r, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#1abc9c";
      ctx.beginPath(); ctx.arc(x + r / 2, y, r, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = "#ff7262";
      ctx.beginPath(); ctx.arc(x + r / 2, y - r, r, 0, 2 * Math.PI); ctx.fill();
      break;
    }
    case "REDUX": {
      ctx.strokeStyle = "#764abc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "#764abc";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case "GIT": {
      ctx.strokeStyle = "#f05032";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - size / 3, y + size / 3);
      ctx.lineTo(x + size / 3, y - size / 3);
      ctx.stroke();
      ctx.fillStyle = "#f05032";
      ctx.beginPath();
      ctx.arc(x - size / 3, y + size / 3, 1.5, 0, 2 * Math.PI);
      ctx.arc(x + size / 3, y - size / 3, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    case "REST APIS": {
      ctx.fillStyle = "#ffb300";
      ctx.fillRect(x - size / 2, y - size / 4, size, size / 2);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 4px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("API", x, y);
      break;
    }
    case "MERN STACK": {
      ctx.fillStyle = "#00e5ff";
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 1.5, 0, 2 * Math.PI);
      ctx.arc(x + 2, y - 2, 1.5, 0, 2 * Math.PI);
      ctx.arc(x, y + 2, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    }
    default: {
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - 2, y - 3);
      ctx.lineTo(x - 4, y);
      ctx.lineTo(x - 2, y + 3);
      ctx.moveTo(x + 2, y - 3);
      ctx.lineTo(x + 4, y);
      ctx.lineTo(x + 2, y + 3);
      ctx.stroke();
    }
  }
  ctx.restore();
};

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, isDown: false });
  const grabbedBodyRef = useRef<PhysicsBody | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on container
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = 220; // fixed height for physics area
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize tags with random positions (adjusted for logos and screen size)
    const isMobileDevice = window.innerWidth < 640;
    const fontSz = isMobileDevice ? 8 : 9;
    const paddingX = isMobileDevice ? 20 : 30;
    const paddingY = isMobileDevice ? 8 : 10;

    let bodies: PhysicsBody[] = TECH_TAGS.map((tag, idx) => {
      ctx.font = `bold ${fontSz}px monospace`;
      const textWidth = ctx.measureText(tag.toUpperCase()).width;
      const width = textWidth + paddingX;
      const height = fontSz + paddingY;
      const radius = width / 2; // circle approximation

      // Spread columns
      const cols = isMobileDevice ? 3 : 5;
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      return {
        label: tag.toUpperCase(),
        x: 20 + col * ((canvas.width - 40) / cols) + Math.random() * 10,
        y: -30 - row * 35, // start above canvas to fall down
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1.5 + 1,
        width,
        height,
        radius,
        mass: radius,
        isGrabbed: false
      };
    });

    // Handle mouse/touch events relative to canvas
    const getCanvasMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const pos = getCanvasMousePos(e);
      mouseRef.current.isDown = true;
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;
      mouseRef.current.px = pos.x;
      mouseRef.current.py = pos.y;

      // Find if clicked on any body
      for (const body of bodies) {
        // Simple distance checking using radius
        const dx = pos.x - body.x;
        const dy = pos.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < body.radius) {
          body.isGrabbed = true;
          grabbedBodyRef.current = body;
          body.vx = 0;
          body.vy = 0;
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const pos = getCanvasMousePos(e);
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = pos.x;
      mouseRef.current.y = pos.y;

      if (grabbedBodyRef.current) {
        grabbedBodyRef.current.x = pos.x;
        grabbedBodyRef.current.y = pos.y;
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
      if (grabbedBodyRef.current) {
        // Apply velocity on throw
        grabbedBodyRef.current.vx = (mouseRef.current.x - mouseRef.current.px) * 0.7;
        grabbedBodyRef.current.vy = (mouseRef.current.y - mouseRef.current.py) * 0.7;
        grabbedBodyRef.current.isGrabbed = false;
        grabbedBodyRef.current = null;
      }
    };

    // Add listeners to canvas
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    canvas.addEventListener("touchstart", handleMouseDown, { passive: true });
    window.addEventListener("touchmove", handleMouseMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    let animationId: number;
    const gravity = 0.25;
    const bounce = 0.55;
    const friction = 0.985;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw bodies
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];

        if (!body.isGrabbed) {
          // Apply gravity
          body.vy += gravity;
          
          // Apply friction/air resistance
          body.vx *= friction;
          body.vy *= friction;

          // Update position
          body.x += body.vx;
          body.y += body.vy;

          // Wall Collisions
          // Floor
          if (body.y + body.height / 2 > canvas.height) {
            body.y = canvas.height - body.height / 2;
            body.vy = -body.vy * bounce;
            // Ground friction
            body.vx *= 0.9;
          }
          // Ceiling (bounce off top boundary)
          if (body.y - body.height / 2 < 0) {
            body.y = body.height / 2;
            body.vy = -body.vy * bounce;
          }
          // Left Wall
          if (body.x - body.width / 2 < 0) {
            body.x = body.width / 2;
            body.vx = -body.vx * bounce;
          }
          // Right Wall
          if (body.x + body.width / 2 > canvas.width) {
            body.x = canvas.width - body.width / 2;
            body.vx = -body.vx * bounce;
          }
        }

        // Handle Body-to-Body Collisions (Circle approximation)
        for (let j = i + 1; j < bodies.length; j++) {
          const other = bodies[j];
          const dx = other.x - body.x;
          const dy = other.y - body.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = body.radius + other.radius;

          if (distance < minDist) {
            // Collision normal
            const nx = dx / distance;
            const ny = dy / distance;

            // Separate overlapping bodies
            const overlap = minDist - distance;
            
            if (!body.isGrabbed && !other.isGrabbed) {
              body.x -= nx * overlap * 0.5;
              body.y -= ny * overlap * 0.5;
              other.x += nx * overlap * 0.5;
              other.y += ny * overlap * 0.5;

              // Relative velocity
              const kx = body.vx - other.vx;
              const ky = body.vy - other.vy;
              
              // Velocity along normal
              const vn = kx * nx + ky * ny;

              if (vn > 0) {
                // Total mass
                const totalMass = body.mass + other.mass;
                const impulse = (2 * vn) / totalMass;

                body.vx -= impulse * other.mass * nx * bounce;
                body.vy -= impulse * other.mass * ny * bounce;
                other.vx += impulse * body.mass * nx * bounce;
                other.vy += impulse * body.mass * ny * bounce;
              }
            } else if (body.isGrabbed) {
              // Push other away if body is grabbed
              other.x += nx * overlap;
              other.y += ny * overlap;
              other.vx += nx * 2;
              other.vy += ny * 2;
            } else if (other.isGrabbed) {
              // Push body away if other is grabbed
              body.x -= nx * overlap;
              body.y -= ny * overlap;
              body.vx -= nx * 2;
              body.vy -= ny * 2;
            }
          }
        }

        // Draw pill capsule
        ctx.save();
        ctx.translate(body.x, body.y);

        // Capsule background
        ctx.fillStyle = body.isGrabbed ? "rgba(0, 229, 255, 0.15)" : "rgba(10, 10, 10, 0.8)";
        ctx.strokeStyle = body.isGrabbed ? "#00e5ff" : "rgba(0, 229, 255, 0.2)";
        ctx.lineWidth = 1.2;

        if (body.isGrabbed) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00e5ff";
        }

        const r = body.height / 2;
        const w = body.width - body.height;

        ctx.beginPath();
        ctx.arc(-w / 2, 0, r, Math.PI / 2, (3 * Math.PI) / 2);
        ctx.lineTo(w / 2, -r);
        ctx.arc(w / 2, 0, r, (3 * Math.PI) / 2, Math.PI / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw logo & text
        ctx.shadowBlur = 0; // turn off glow for text
        
        const isMobileCanvas = canvas.width < 640;
        const currentFontSz = isMobileCanvas ? 8 : 9;
        const currentLogoSz = isMobileCanvas ? 8 : 10;
        const textOffset = isMobileCanvas ? 5 : 7;

        ctx.font = `bold ${currentFontSz}px monospace`;
        const textWidth = ctx.measureText(body.label).width;
        
        // Draw logo centered left of text
        const logoX = -textWidth / 2 - 3;
        const logoY = 0;
        drawLogo(ctx, body.label, logoX, logoY, currentLogoSz);

        // Draw text shifted right
        ctx.fillStyle = body.isGrabbed ? "#ffffff" : "rgba(255, 255, 255, 0.8)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(body.label, textOffset, 0.5);

        ctx.restore();
      }

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <footer className="w-full py-12 px-6 bg-[#080808]/90 backdrop-blur-md z-10 relative">
      <div ref={containerRef} className="max-w-6xl mx-auto flex flex-col gap-10">
        
        {/* Interactive Physics sandbox container */}
        <div className="w-full flex flex-col gap-2 relative">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Gamepad2 size={13} className="text-cyan-400 animate-bounce" />
              Interactive Tech Stack Playground (Grab &amp; throw tags!)
            </span>
            <span className="text-[9px] font-mono text-cyan-400/60 uppercase tracking-widest">
              Matter Engine Mock
            </span>
          </div>
          
          <div className="w-full h-[220px] rounded-2xl border border-cyan-500/10 bg-zinc-950/40 relative overflow-hidden select-none cursor-grab active:cursor-grabbing">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>
        </div>

        {/* Normal footer sections */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          {/* Logo & Note */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <span className="font-display font-black text-sm tracking-widest text-white uppercase flex items-center gap-1">
              SHEHEER<span className="text-cyan-400">.</span>CB
            </span>
            <p className="text-[10px] text-zinc-500 max-w-xs font-mono uppercase tracking-wider">
              Designing and developing beautiful, high-performance web experiences.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/muhammedsheheercb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-cyan-400 transition-colors p-2 rounded-full border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="http://linkedin.com/in/mohammed-sheheer-c-b-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-cyan-400 transition-colors p-2 rounded-full border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="mailto:muhammedsheheercb@gmail.com"
              className="text-zinc-400 hover:text-cyan-400 transition-colors p-2 rounded-full border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              title="Email"
            >
              <Mail size={16} />
            </a>
          </div>

          {/* Copyright details */}
          <div className="text-center md:text-right">
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Mohammed Sheheer CB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
