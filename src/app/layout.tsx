import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PUNCHED CARDS | When AI Goes Down, Go Analog",
  description:
    "Premium punch cards for the post-AI developer. Level up your skills when the machines stop thinking. 100% uptime guaranteed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${ibmPlexMono.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
