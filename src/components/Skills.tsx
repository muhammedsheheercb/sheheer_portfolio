"use client";

import { useState } from "react";
import { Cpu, Layout, Server, Wrench } from "lucide-react";

interface SkillItem {
  name: string;
  level: number; // percentage
  category: "frontend" | "backend" | "tools";
  description: string;
}

const SKILLS_DATA: SkillItem[] = [
  // Frontend
  { name: "Next.js", level: 90, category: "frontend", description: "Expert in App Router, Server Components, SSR/SSG rendering, and SEO optimizations." },
  { name: "React", level: 95, category: "frontend", description: "Proficient in hooks, custom states, contexts, and lightweight components performance." },
  { name: "TypeScript", level: 85, category: "frontend", description: "Strong type-safety, interface design, generics, and strict configurations." },
  { name: "JavaScript", level: 95, category: "frontend", description: "Deep understanding of ES6+, DOM manipulation, event loop, closures, and async programming." },
  { name: "HTML", level: 95, category: "frontend", description: "Semantic markup, SEO optimization, accessibility (ARIA), and DOM structure." },
  { name: "CSS", level: 90, category: "frontend", description: "Modern layout models (Flexbox, Grid), responsive media queries, CSS variables, and advanced animation techniques." },
  { name: "Tailwind CSS", level: 95, category: "frontend", description: "Fluid utility classes, theme customization, custom grids, and fluid layout builders." },
  { name: "TanStack Query", level: 85, category: "frontend", description: "Efficient server-state management, caching, background refetching, and query synchronization." },
  { name: "Bootstrap", level: 88, category: "frontend", description: "Rapid responsive layouts, grid systems, and component utility frameworks." },
  { name: "GSAP", level: 80, category: "frontend", description: "Creating timelines, ScrollTrigger canvas integrations, and fluid timeline animations." },
  { name: "Framer Motion", level: 85, category: "frontend", description: "Fluid layout animations, exit transitions, gestural tracking, and page morphs." },
  { name: "Redux", level: 80, category: "frontend", description: "Global state management, slices, middle-wares, and toolkit implementations." },
  { name: "ShadCN UI", level: 90, category: "frontend", description: "Rapid styling, modular accessibility interfaces, and customized compound components." },

  // Backend
  { name: "Node.js", level: 85, category: "backend", description: "Server runtimes, event loops, stream utilities, and file system management." },
  { name: "Express.js", level: 90, category: "backend", description: "RESTful API routes, custom middlewares, controller patterns, and security filters." },
  { name: "Hono", level: 85, category: "backend", description: "Ultrafast web framework for Cloudflare Workers, Deno, and Node.js with built-in routing." },
  { name: "Clean Architecture", level: 85, category: "backend", description: "Decoupled software design patterns, domain-driven design, and dependency injection." },
  { name: "JWT Auth", level: 88, category: "backend", description: "Secure JSON Web Tokens, cookies, authentication sessions, and payload structures." },
  { name: "REST APIs", level: 90, category: "backend", description: "Standard HTTP methods, status structures, standard queries, and payload filters." },

  // Database & Tools
  { name: "MongoDB", level: 88, category: "tools", description: "NoSQL collections, aggregation query pipelines, schemas, and connection pools." },
  { name: "PostgreSQL", level: 80, category: "tools", description: "Relational database mapping, SQL joins, database index patterns, and migration tools." },
  { name: "Razorpay", level: 90, category: "tools", description: "Integrating secure payment gateways, checkout forms, webhook handlers, and subscription management." },
  { name: "DSA", level: 82, category: "tools", description: "Problem-solving using arrays, trees, graphs, sorting, and algorithmic optimization patterns." },
  { name: "Git / GitHub", level: 90, category: "tools", description: "Version controls, branches, pull requests, rebase, and actions pipelines." },
  { name: "Figma", level: 75, category: "tools", description: "Extracting vectors, inspecting CSS tokens, grid mockups, and wireframe prototypes." },
  { name: "Postman", level: 85, category: "tools", description: "API request collection blocks, test validation scripts, and environment setups." },
];

export default function Skills() {
  const [filter, setFilter] = useState<"all" | "frontend" | "backend" | "tools">("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(SKILLS_DATA[0]);

  const filteredSkills = SKILLS_DATA.filter(
    (skill) => filter === "all" || skill.category === filter
  );

  return (
    <section id="skills" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
      {/* Section Title */}
      <div className="flex flex-col gap-3 mb-12 text-center md:text-left">
        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase self-center md:self-start">
          // 02 . TECHNOLOGY INDEX
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Technical Skills
        </h2>
        <p className="text-zinc-400 max-w-lg text-sm">
          Click on any skill node to view deep architectural implementation details and experience logs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
        {[
          { id: "all", label: "All Skills", icon: Cpu },
          { id: "frontend", label: "Frontend", icon: Layout },
          { id: "backend", label: "Backend", icon: Server },
          { id: "tools", label: "Databases & Tools", icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setFilter(tab.id as any);
                const matches = SKILLS_DATA.filter(s => tab.id === "all" || s.category === tab.id);
                if (matches.length > 0) setSelectedSkill(matches[0]);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase flex items-center gap-2 border transition-all duration-300 ${isActive
                  ? "bg-cyan-400 border-cyan-300 text-black shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                  : "bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-100 hover:border-white/10"
                }`}
            >
              <Icon size={11} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Skills Nodes list */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.name === skill.name;
            return (
              <button
                key={skill.name}
                onClick={() => setSelectedSkill(skill)}
                className={`p-3 sm:p-4 rounded-xl text-left border flex flex-col justify-between min-h-[5.5rem] h-auto transition-all duration-300 group ${isSelected
                    ? "bg-cyan-500/10 border-cyan-400/80 shadow-[0_0_15px_rgba(0,229,255,0.05)]"
                    : "bg-white/[0.01] border-white/5 hover:border-cyan-500/20 hover:bg-white/[0.03]"
                  }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? "text-cyan-300" : "text-zinc-300 group-hover:text-white"
                  }`}>
                  {skill.name}
                </span>

                <div className="w-full mt-2">
                  <div className="flex justify-between text-[8px] text-zinc-500 font-mono mb-1">
                    <span>PROFICIENCY</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isSelected ? "bg-gradient-to-r from-cyan-400 to-teal-300" : "bg-zinc-600"
                        }`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Skill Inspector Details */}
        <div className="lg:col-span-5">
          {selectedSkill ? (
            <div className="w-full rounded-2xl glass-panel p-5 sm:p-6 border border-cyan-500/10 shadow-[0_0_20px_rgba(0,229,255,0.02)] animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  {selectedSkill.name}
                </h3>
                <span className="text-[9px] uppercase font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-300">
                  {selectedSkill.category}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono mb-2">
                  <span>Confidence Level</span>
                  <span className="font-bold text-cyan-300">{selectedSkill.level}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300 transition-all duration-500"
                    style={{ width: `${selectedSkill.level}%` }}
                  />
                </div>
              </div>

              {/* Inspector details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">
                    Usage Description
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedSkill.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[9px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5">
                    Best Practice Standard
                  </h4>
                  <p className="text-zinc-400 text-[10px] leading-relaxed">
                    Integrated across multiple modern projects, including static generation page routers, database schemas, and highly interactive GSAP scrolling templates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl glass-panel p-6 border border-white/5 text-center py-12 text-zinc-500 text-xs uppercase tracking-wider font-mono">
              Select a skill to inspect its metadata details.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
