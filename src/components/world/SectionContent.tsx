"use client";
import Image from "next/image";
import { useContext } from "react";
import { InteractionContext } from "./InteractionContext";
import Contact from "@/components/Contact";
import {
  profile,
  PROJECTS_DATA,
  SKILLS_DATA,
  TIMELINE_DATA,
  type Destination,
} from "@/lib/portfolio";
export default function SectionContent({
  section,
  onProject,
}: {
  section: Destination;
  onProject?: (index: number) => void;
}) {
  const contextOpen = useContext(InteractionContext);
  const viewProject = onProject ?? contextOpen;
  if (section === "home" || section === "about")
    return (
      <div className="about-content">
        <span className="eyebrow">THRISSUR, KERALA · INDIA</span>
        <h2>
          {section === "home"
            ? "Hello, I’m Sheheer."
            : "Good design. Solid engineering."}
        </h2>
        <p className="lead">{profile.title}</p>
        <p>{profile.intro}</p>
        <div className="about-monogram">
          SCB<span>Building for the web.</span>
        </div>
        <p>Available for roles and exciting projects.</p>
        <a
          className="text-link"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore my GitHub ↗
        </a>
        <a
          className="text-link"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on LinkedIn ↗
        </a>
      </div>
    );
  if (section === "projects" || section === "gallery")
    return (
      <>
        <span className="eyebrow">
          {section === "gallery" ? "THE DESIGN GALLERY" : "SELECTED CREATIONS"}
        </span>
        <h2>{section === "gallery" ? "A closer look." : "Ideas, shipped."}</h2>
        <p>
          {section === "gallery"
            ? "Original previews from my seven web projects. Select an image to explore it in detail."
            : "A selection of real-world products, frontend experiments, and interactive interfaces that I have built."}
        </p>
        <div className="project-grid">
          {PROJECTS_DATA.map((p, i) => (
            <article key={p.title}>
              <button
                className="project-image"
                onClick={() => viewProject?.(i)}
                aria-label={`View ${p.title}`}
              >
                <Image
                  src={p.image}
                  alt={`${p.title} website preview`}
                  width={720}
                  height={420}
                  sizes="(max-width: 600px) 90vw, 400px"
                />
              </button>
              <span className="eyebrow">{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a
                className="text-link"
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit project ↗
              </a>
            </article>
          ))}
        </div>
      </>
    );
  if (section === "experience")
    return (
      <>
        <span className="eyebrow">CAREER & EDUCATION</span>
        <h2>The journey so far.</h2>
        <p>
          A timeline of my professional work experience and academic background
          in software engineering.
        </p>
        <div className="career-list">
          {TIMELINE_DATA.map((item) => (
            <article key={item.title}>
              <span className="eyebrow">
                {item.date} · {item.type}
              </span>
              <h3>{item.title}</h3>
              <p className="company">{item.subtitle}</p>
              <ul>
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </>
    );
  if (section === "skills")
    return (
      <>
        <span className="eyebrow">THE WORKSHOP · TECHNOLOGY INDEX</span>
        <h2>Tools of the trade.</h2>
        <p>
          My skills across frontend engineering, backend architecture,
          databases, and design tools.
        </p>
        {["frontend", "backend", "tools"].map((category) => (
          <div key={category}>
            <h3 className="skill-heading">
              {category === "tools" ? "Databases & tools" : category}
            </h3>
            <div className="skill-grid">
              {SKILLS_DATA.filter((s) => s.category === category).map((s) => (
                <article key={s.name}>
                  <h4>
                    {s.name}
                    <span>{s.level}%</span>
                  </h4>
                  <meter min={0} max={100} value={s.level}>
                    {s.level}%
                  </meter>
                  <p>{s.description}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  return (
    <>
      <span className="eyebrow">THE CONTACT CABIN</span>
      <h2>Let’s make something good.</h2>
      <Contact />
      <div className="social-row">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </div>
    </>
  );
}
