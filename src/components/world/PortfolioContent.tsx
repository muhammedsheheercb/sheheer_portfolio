import { profile, type Destination } from "@/lib/portfolio";
import SectionContent from "./SectionContent";
export default function PortfolioContent() {
  return (
    <main className="reading-content">
      <header id="read-home">
        <span className="eyebrow">THE PORTFOLIO OF</span>
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <nav aria-label="Reading view sections">
          {[
            "home",
            "about",
            "projects",
            "gallery",
            "experience",
            "skills",
            "contact",
          ].map((id) => (
            <a key={id} href={`#read-${id}`}>
              {id}
            </a>
          ))}
        </nav>
      </header>
      {(
        [
          "about",
          "projects",
          "gallery",
          "experience",
          "skills",
          "contact",
        ] as Destination[]
      ).map((section) => (
        <section id={`read-${section}`} key={section}>
          <SectionContent section={section} />
        </section>
      ))}
      <footer>
        © {new Date().getFullYear()} {profile.name} · Designed and developed in
        Kerala.
      </footer>
    </main>
  );
}
