"use client";

import { Briefcase, Calendar, GraduationCap } from "lucide-react";

interface TimelineItem {
  type: "work" | "education";
  title: string;
  subtitle: string;
  date: string;
  points: string[];
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    type: "work",
    title: "Full Stack Developer",
    subtitle: "Yenrich31 – Kerala (Remote)",
    date: "Jan 2025 - Present",
    points: [
      "Developed a Next.js restaurant booking web application, improving client reservations by 30%.",
      "Designed responsive UI elements using React and Tailwind CSS, adhering to strict mobile-first design paradigms.",
      "Collaborated in an Agile development squad, managing tasks via GitHub workflows and participating in sprint retrospectives."
    ],
  },
  {
    type: "education",
    title: "MERN Stack Development Certificate",
    subtitle: "Brototype – Ernakulam, Kerala",
    date: "Apr 2024 - Dec 2024",
    points: [
      "Completed an intensive offline technical training program in full-stack MERN engineering.",
      "Developed clean-architecture codebases, REST APIs, and managed Mongo collections/relational DB models.",
      "Completed multiple hands-on product builds, including payment integrations and state management libraries."
    ],
  },
  {
    type: "education",
    title: "Master of Business Administration (MBA)",
    subtitle: "SGUV University",
    date: "Apr 2022 - Apr 2024",
    points: [
      "Specialized in business management, communication, agile methodologies, and professional operations.",
      "Acquired key product management, client consultation, and strategic planning skills."
    ],
  },
];

export default function Timeline() {
  return (
    <section id="experience" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
      {/* Section Title */}
      <div className="flex flex-col gap-3 mb-16 text-center md:text-left">
        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase self-center md:self-start">
          // 03 . CAREER &amp; JOURNEY
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Experience &amp; Education
        </h2>
        <p className="text-zinc-400 max-w-lg text-sm">
          A timeline of my professional work experience and academic background in software engineering.
        </p>
      </div>

      {/* Timeline Tree */}
      <div className="relative border-l border-white/5 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12">
        {TIMELINE_DATA.map((item, idx) => {
          const IconComponent = item.type === "work" ? Briefcase : GraduationCap;
          return (
            <div key={idx} className="relative group">
              {/* Node Indicator Icon */}
              <span className="absolute -left-[38px] md:-left-[54px] top-1.5 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-[#080808] border border-white/10 text-zinc-400 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all duration-300 shadow-md">
                <IconComponent size={14} className="md:w-[16px] md:h-[16px]" />
              </span>

              {/* Card content */}
              <div className="rounded-2xl glass-panel p-4 sm:p-6 border border-white/5 hover:border-cyan-500/15 hover:bg-white/[0.02] transition-all duration-300">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">{item.subtitle}</p>
                  </div>
                  {/* Date badge */}
                  <span className="inline-flex items-center gap-1.5 self-start md:self-center text-[10px] font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    <Calendar size={11} />
                    <span>{item.date}</span>
                  </span>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed list-disc list-inside">
                  {item.points.map((point, pIdx) => (
                    <li key={pIdx} className="hover:text-zinc-300 transition-colors pl-1">
                      <span className="relative left-[-4px]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
