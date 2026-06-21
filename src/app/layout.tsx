import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Syne, Mr_De_Haviland } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const mrDeHaviland = Mr_De_Haviland({
  weight: "400",
  variable: "--font-mr-de-haviland",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohammed Sheheer CB | Premium Frontend Showcase Portfolio",
  description: "Explore the works of Mohammed Sheheer CB, a premium Full Stack & Frontend Developer specializing in React, Next.js, Node.js, and interactive user interfaces.",
  keywords: ["Mohammed Sheheer CB", "Sheheer", "Frontend Developer Portfolio", "Next.js Developer Portfolio", "React Developer Kerala", "MERN Stack Developer", "GSAP developer", "Framer Motion portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${plusJakartaSans.variable} ${mrDeHaviland.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#05050a] text-zinc-100 font-body antialiased selection:bg-violet-500/30 selection:text-violet-200">
        {children}
      </body>
    </html>
  );
}
