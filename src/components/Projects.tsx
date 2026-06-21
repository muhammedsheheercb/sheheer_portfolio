"use client";

import { ExternalLink, Folder, LineChart, Code, ShieldCheck, Eye, Compass, Waves, History } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons";

interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl?: string;
  category: "Full Stack" | "Frontend Showcase" | "Web App";
  icon: React.ComponentType<any>;
  image: string;
}

const PROJECTS_DATA: Project[] = [
  {
    title: "MAMA Dental Clinic",
    description: "Premium healthcare landing page & appointment router featuring localization SEO, interactive services, aligner modules, and full mobile optimization.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SEO Schema"],
    liveUrl: "https://mama-dental-clinic.vercel.app/",
    category: "Frontend Showcase",
    icon: ShieldCheck,
    image: "/images/1.webp",
  },
  {
    title: "Auction ERP System",
    description: "Enterprise auction management suite with real-time bidding dashboards, item status trackers, and MERN stack secure backend operations.",
    tags: ["MERN Stack", "React", "Node.js", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://auction-erp.vercel.app/",
    category: "Full Stack",
    icon: LineChart,
    image: "/images/2.webp",
  },
  {
    title: "Oregano Restaurant",
    description: "High-end dining reservation and food ordering system with dynamic menu layouts, instant checkout hooks, and table assignment widgets.",
    tags: ["Next.js", "Tailwind CSS", "React", "State Management"],
    liveUrl: "https://oregano-lac.vercel.app/",
    category: "Frontend Showcase",
    icon: Compass,
    image: "/images/3.webp",
  },
  {
    title: "Villa Selena",
    description: "Luxury resort booking showcase focusing on immersive photography grids, layout transitions, and high-fidelity room amenity builders.",
    tags: ["React", "CSS Modules", "Intersection Observer"],
    liveUrl: "https://villa-selena-black.vercel.app/",
    category: "Frontend Showcase",
    icon: Eye,
    image: "/images/4.webp",
  },
  {
    title: "SDK Black",
    description: "A dark-themed ultra-sleek developer SDK portal featuring interactive API playground logs and clean code snippet renderers.",
    tags: ["React", "Next.js", "API Integrations", "Tailwind CSS"],
    liveUrl: "https://sdk-black.vercel.app/",
    category: "Frontend Showcase",
    icon: Code,
    image: "/images/5.webp",
  },
  {
    title: "Animated Web Experience",
    description: "A showcase of highly complex UI animations, scroll triggers, custom physics curves, and typography morphing.",
    tags: ["HTML", "CSS", "GSAP", "ScrollTrigger", "JavaScript"],
    liveUrl: "https://animated-web-apr-8.vercel.app/",
    category: "Frontend Showcase",
    icon: Waves,
    image: "/images/6.webp",
  },
  {
    title: "Tippu Sulthan",
    description: "A graphical history showcase featuring custom storytelling slides, SVG graphics animations, and responsive editorial layout patterns.",
    tags: ["HTML", "CSS Animations", "Vanilla JS", "Responsive Design"],
    liveUrl: "https://tippu-sulthan.vercel.app/",
    category: "Frontend Showcase",
    icon: History,
    image: "/images/7.webp",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
      {/* Section Title */}
      <div className="flex flex-col gap-3 mb-16 text-center md:text-left">
        <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase self-center md:self-start">
          // 01 . SELECTED CREATIONS
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
          Featured Projects
        </h2>
        <p className="text-zinc-400 max-w-lg text-sm">
          A selection of real-world products, frontend experiments, and interactive interfaces that I have built.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS_DATA.map((project, idx) => {
          const Icon = project.icon;
          return (
            <div
              key={idx}
              onClick={() => window.open(project.liveUrl, "_blank", "noopener,noreferrer")}
              data-cursor="live"
              className="group relative rounded-2xl glass-panel flex flex-col justify-between min-h-[380px] border border-white/5 hover:border-cyan-500/20 hover:shadow-[0_10px_30px_-10px_rgba(0,229,255,0.15)] transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Image Thumbnail Header with overlay icon badge */}
              <div className="w-full h-44 bg-zinc-950/60 border-b border-white/5 flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-950/20 transition-all duration-500">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />

                {/* Split Icon Badge overlay */}
                <div className="absolute top-3 left-3 h-8 w-8 rounded-xl glass-panel border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.15)] group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all duration-300">
                  <Icon size={15} />
                </div>

                {/* Bottom dark gradient fade to blend the image seamlessly with text */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/5 text-cyan-400 border border-cyan-500/10">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {project.githubUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.githubUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5 bg-transparent border-0"
                          title="View Code"
                        >
                          <Github size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                        }}
                        className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer p-0.5 bg-transparent border-0"
                        title="Live Preview"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1.5 uppercase tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tags / Tech list */}
                <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-white/5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono text-zinc-500 bg-white/[0.01] px-2 py-0.5 rounded border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
