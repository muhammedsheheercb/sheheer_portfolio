import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Mohammed Sheheer CB | Interactive Developer Portfolio",
  description:
    "Explore the works of Mohammed Sheheer CB, a premium Full Stack & Frontend Developer specializing in React, Next.js, Node.js, and interactive user interfaces.",
  openGraph: {
    title: "Mohammed Sheheer CB | Interactive Developer Portfolio",
    description:
      "A little world of frontend engineering, full stack projects, and creative ideas. Explore Sheheer’s portfolio.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Sheheer CB | Interactive Developer Portfolio",
  },
  keywords: [
    "Mohammed Sheheer CB",
    "Sheheer",
    "Frontend Developer Portfolio",
    "Next.js Developer Portfolio",
    "React Developer Kerala",
    "MERN Stack Developer",
    "GSAP developer",
    "Framer Motion portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} h-full`}
    >
      <body className="min-h-full font-body antialiased">{children}</body>
    </html>
  );
}
