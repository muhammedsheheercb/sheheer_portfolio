import Navbar from "@/components/Navbar";
import InteractiveBg from "@/components/InteractiveBg";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#080808] text-zinc-100">
      {/* Glowing Viewport Vignette Frame */}
      <div className="viewport-vignette" />

      {/* 1. Custom Interactive Cursor */}
      <CustomCursor />

      {/* Preloader Splash Screen */}
      <Preloader />

      {/* 2. Interactive Matrix Rain Background */}
      <InteractiveBg />

      {/* 3. Floating Glassmorphic Navigation */}
      <Navbar />

      {/* 4. Main Portfolio Sections */}
      <main className="flex-1 w-full flex flex-col">
        <Hero />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      {/* 5. Custom Physics Tag Sandbox Footer */}
      <Footer />
    </div>
  );
}
