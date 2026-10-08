import WorldExperience from "@/components/world/WorldExperience";
import PortfolioContent from "@/components/world/PortfolioContent";
import { profile } from "@/lib/portfolio";
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.title,
            email: profile.email,
            sameAs: [profile.github, profile.linkedin],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Thrissur",
              addressRegion: "Kerala",
              addressCountry: "IN",
            },
          }),
        }}
      />
      <WorldExperience>
        <PortfolioContent />
      </WorldExperience>
      <noscript>
        <style>{`.reading-shell{display:block!important}.world-stage,.launch-screen,.game-brand,.return-world{display:none!important}`}</style>
      </noscript>
    </>
  );
}
