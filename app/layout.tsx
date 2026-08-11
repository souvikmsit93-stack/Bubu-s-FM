import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans, Yatra_One } from "next/font/google";
import "./globals.css";

const display = Yatra_One({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = DM_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = "Tempo FM";
const description = "90s Bollywood that plays in the back of an auto.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title,
  description,
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
  openGraph: { title, description, siteName: title, type: "website", ...(siteUrl && { url: siteUrl }) },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
