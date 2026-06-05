import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solvark | Premium Web Development & Brand Identity Agency",
  description: "Solvark is a growth-focused digital partner. We build ultra-fast, premium websites, e-commerce stores, and visual brands that convert visitors into customers.",
  keywords: ["Web Development", "E-commerce Development", "Branding", "Website Redesign", "Next.js", "React Agency"],
  metadataBase: new URL("https://solvark.com"),
  openGraph: {
    title: "Solvark | Premium Web Development & Brand Identity Agency",
    description: "Solvark is a growth-focused digital partner. We build ultra-fast, premium websites, e-commerce stores, and visual brands.",
    type: "website",
    locale: "en_US",
    siteName: "Solvark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
