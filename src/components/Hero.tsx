"use client";

import { ArrowRight, Sparkles, Terminal, Mail, Check, Copy, Disc, MapPin, Activity } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const email = "muhammedsheheercb@gmail.com";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.getElementById("projects");
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Generate simulated GitHub contribution dots
  const contribWeeks = 24;
  const contribDays = 7;
  const generateContributions = () => {
    const grid = [];
    for (let w = 0; w < contribWeeks; w++) {
      const week = [];
      for (let d = 0; d < contribDays; d++) {
        // Random level: 0 (none), 1 (light cyan), 2 (mid cyan), 3 (bright cyan)
        const rand = Math.random();
        const level = rand > 0.85 ? 3 : rand > 0.6 ? 2 : rand > 0.35 ? 1 : 0;
        week.push(level);
      }
      grid.push(week);
    }
    return grid;
  };
  const [contribGrid] = useState(generateContributions());

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 max-w-6xl mx-auto z-10"
    >
      <div className="flex flex-col gap-6 text-left max-w-3xl">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>STATUS: ACTIVE &amp; AVAILABLE FOR ROLES</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4.5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white">
          SHEHEER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 drop-shadow-[0_0_20px_rgba(0,229,255,0.2)]">
            DEVELOPER
          </span>
        </h1>

        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-zinc-400 uppercase">
          Frontend Engineer &amp; Full Stack Architect
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
          I craft visually stunning, highly interactive web applications that combine pixel-perfect design with solid, high-performance architecture. Based in Kerala, India.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button
            onClick={handleScrollToProjects}
            className="group px-6 py-3 rounded-full bg-cyan-400 text-black font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.15)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span>Explore Works</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>

          <button
            onClick={handleCopyEmail}
            data-cursor="copy"
            className="px-6 py-3 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-zinc-200 font-bold uppercase tracking-wider text-xs flex items-center gap-2 transition-all duration-300 active:scale-95"
          >
            {copied ? (
              <>
                <Check size={14} className="text-cyan-400" />
                <span className="text-cyan-400">Copied!</span>
              </>
            ) : (
              <>
                <Mail size={14} className="text-zinc-400" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-grid of custom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-16 pt-12 border-t border-white/5">
        {/* Widget 1: Spotify Widget */}
        <div className="md:col-span-4 rounded-2xl glass-panel p-5 border border-white/5 flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Disc size={10} className="animate-spin text-cyan-400" />
              Now Playing
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            {/* Simulated cover art */}
            <div className="h-12 w-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 to-black" />
              <Activity size={18} className="text-cyan-400 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate uppercase tracking-wider">
                Resonance
              </h4>
              <p className="text-[10px] text-zinc-500 truncate">
                HOME — Synthwave Essentials
              </p>
            </div>
          </div>

          {/* Equalizer animation */}
          <div className="flex items-end gap-0.5 h-6 mt-4">
            <div className="w-1 bg-cyan-500/60 rounded-full animate-[eq-bar-1_1.2s_ease-in-out_infinite]" style={{ height: "40%" }} />
            <div className="w-1 bg-cyan-400 rounded-full animate-[eq-bar-2_0.8s_ease-in-out_infinite]" style={{ height: "80%" }} />
            <div className="w-1 bg-cyan-500/80 rounded-full animate-[eq-bar-3_1.5s_ease-in-out_infinite]" style={{ height: "60%" }} />
            <div className="w-1 bg-cyan-400/90 rounded-full animate-[eq-bar-4_1.0s_ease-in-out_infinite]" style={{ height: "90%" }} />
            <div className="w-1 bg-cyan-500/40 rounded-full animate-[eq-bar-5_1.3s_ease-in-out_infinite]" style={{ height: "30%" }} />
            <div className="w-1 bg-cyan-400/70 rounded-full animate-[eq-bar-1_0.9s_ease-in-out_infinite]" style={{ height: "70%" }} />
          </div>

          <style jsx global>{`
            @keyframes eq-bar-1 { 0%, 100% { height: 30%; } 50% { height: 75%; } }
            @keyframes eq-bar-2 { 0%, 100% { height: 85%; } 50% { height: 40%; } }
            @keyframes eq-bar-3 { 0%, 100% { height: 50%; } 50% { height: 95%; } }
            @keyframes eq-bar-4 { 0%, 100% { height: 95%; } 50% { height: 60%; } }
            @keyframes eq-bar-5 { 0%, 100% { height: 25%; } 50% { height: 80%; } }
          `}</style>
        </div>

        {/* Widget 2: GitHub contribution tracker */}
        <div className="md:col-span-5 rounded-2xl glass-panel p-5 border border-white/5 flex flex-col justify-between min-h-[140px] hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              GitHub contributions
            </span>
            <span className="text-[10px] font-bold text-white font-mono">
              1,424 commits / yr
            </span>
          </div>

          {/* Grid Layout of dots */}
          <div className="flex gap-[3px] overflow-x-auto scrollbar-none py-1">
            {contribGrid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px] shrink-0">
                {week.map((level, dIdx) => (
                  <span
                    key={dIdx}
                    className={`h-[7px] w-[7px] rounded-[1px] transition-colors ${level === 3
                      ? "bg-cyan-400 shadow-[0_0_4px_rgba(0,229,255,0.4)]"
                      : level === 2
                        ? "bg-cyan-600/70"
                        : level === 1
                          ? "bg-cyan-900/40"
                          : "bg-white/[0.02]"
                      }`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 text-[9px] text-zinc-500 font-mono">
            <span>Less</span>
            <div className="flex gap-[3px]">
              <span className="h-[7px] w-[7px] rounded-[1px] bg-white/[0.02]" />
              <span className="h-[7px] w-[7px] rounded-[1px] bg-cyan-900/40" />
              <span className="h-[7px] w-[7px] rounded-[1px] bg-cyan-600/70" />
              <span className="h-[7px] w-[7px] rounded-[1px] bg-cyan-400" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Widget 3: Live System Clock and Coordinates */}
        <div className="md:col-span-3 rounded-2xl glass-panel p-5 border border-white/5 flex flex-col justify-between min-h-[140px] hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              Local Station
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
              <MapPin size={10} className="text-cyan-400" />
              IN_CC
            </span>
          </div>

          <div>
            <span className="text-2xl font-bold font-mono text-white tracking-widest">
              {currentTime || "12:00:00"}
            </span>
            <p className="text-[9px] text-zinc-500 font-mono mt-1 uppercase">
              Thrissur, Kerala — UTC+5:30
            </p>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-cyan-400/80">
            <span>LAT: 10.5276° N</span>
            <span>LNG: 76.2144° E</span>
          </div>
        </div>
      </div>
    </section>
  );
}
