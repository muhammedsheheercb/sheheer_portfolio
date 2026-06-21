"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/icons";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set scroll state for subtle visual updates
      setScrolled(window.scrollY > 20);

      // Section tracking
      const sections = NAV_ITEMS.map((item) =>
        document.getElementById(item.href.replace("#", ""))
      );

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= section.offsetTop) {
          setActiveSection(NAV_ITEMS[i].href.replace("#", ""));
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      setMobileMenuOpen(false);
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[90%] max-w-6xl">
      {/* Navbar Container */}
      <div
        className={`w-full rounded-full glass-panel px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-500 ${scrolled
            ? "shadow-2xl shadow-cyan-500/5 border-cyan-500/10 bg-black/80"
            : "shadow-xl shadow-black/10 border-white/5 bg-[#0a0a0a]/60"
          }`}
      >
        {/* Animated Coding Name Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="flex items-center gap-1.5 group select-none py-0.5"
        >
          <span
            className="text-2.5xl sm:text-4xl tracking-wide text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.4)] group-hover:text-cyan-300 transition-all duration-300"
            style={{ fontFamily: "var(--font-mr-de-haviland), cursive" }}
          >
            Mohammed Sheheer
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${isActive ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-100"
                  }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-full -z-10 shadow-[0_0_12px_rgba(0,229,255,0.05)]" />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Button & Socials */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/muhammedsheheercb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-cyan-400 transition-colors p-1.5 rounded-full hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10"
            title="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="http://linkedin.com/in/mohammed-sheheer-c-b-"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-cyan-400 transition-colors p-1.5 rounded-full hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/10"
            title="LinkedIn"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="px-4 py-1.5 rounded-full border border-cyan-400/50 bg-transparent text-cyan-400 text-xs font-bold tracking-wider uppercase hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(0,229,255,0.05)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] active:scale-95 transition-all duration-300"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/5 rounded-full transition-colors border border-transparent hover:border-cyan-500/10"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[3.25rem] sm:top-16 left-0 right-0 glass-panel rounded-3xl p-6 flex flex-col gap-4 shadow-2xl border border-cyan-500/10 bg-black/95 animate-in fade-in slide-in-from-top-4 duration-300 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider uppercase transition-all duration-200 ${isActive
                      ? "bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400 pl-6"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <hr className="border-white/5 my-1" />

          {/* Socials & Hire button on mobile */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/muhammedsheheercb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-cyan-400 transition-colors p-2 rounded-xl hover:bg-white/5"
              >
                <Github size={20} />
              </a>
              <a
                href="http://linkedin.com/in/mohammed-sheheer-c-b-"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-cyan-400 transition-colors p-2 rounded-xl hover:bg-white/5"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="px-5 py-2.5 rounded-xl border border-cyan-400 bg-transparent text-cyan-400 text-xs font-bold tracking-wider uppercase text-center hover:bg-cyan-400 hover:text-black transition-all duration-300"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
