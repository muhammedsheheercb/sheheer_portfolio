"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "Hello",       // English
  "नमस्ते",       // Hindi
  "مرحباً",       // Arabic
  "ഹലോ",         // Malayalam
  "你好",        // Chinese
  "Hola"         // Spanish
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Disable body scroll when loading
    document.body.style.overflow = "hidden";

    // Cycle through words
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === WORDS.length - 1) {
          clearInterval(interval);
          // Start fade out after the last word
          setTimeout(() => {
            setFadeOut(true);
            // Restore body scroll after preloader ends
            setTimeout(() => {
              setVisible(false);
              document.body.style.overflow = "";
            }, 600); // fade out duration
          }, 350);
          return prev;
        }
        return prev + 1;
      });
    }, 350); // cycle word every 350ms

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#050508] z-[9999] flex items-center justify-center transition-all duration-600 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Dynamic scanline/glitch overlay for preloader */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />

      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-[0.01] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <div className="flex flex-col items-center gap-6 relative select-none">
        {/* Circle preloader ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-white/80 border-t-transparent animate-spin" style={{ animationDuration: "1s" }} />
          <div className="absolute inset-2 rounded-full border border-white/5 bg-zinc-950/40 backdrop-blur-md" />
          
          {/* Faint pulsing core */}
          <div className="absolute w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
        </div>

        {/* Word container with key-based re-render to trigger fade-in CSS animations */}
        <div className="h-16 flex items-center justify-center">
          <h1
            key={index}
            className="text-4xl sm:text-5xl font-display font-black text-white tracking-wide animate-fade-in-up"
          >
            {WORDS[index]}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-40 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-white/80 transition-all duration-300 ease-out" 
            style={{ width: `${((index + 1) / WORDS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
