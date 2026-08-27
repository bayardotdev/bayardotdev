import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "bayar.dev — Enterprise AI infrastructure";
const description =
  "Enterprise AI infrastructure & automated workflows built for modern software teams.";

export const metadata: Metadata = {
  metadataBase: new URL("https://bayar.dev"),
  // Subpages set their own title; this template keeps the brand suffix on them.
  title: {
    default: title,
    template: "%s — bayar.dev",
  },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "bayar.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-emerald-500/30">
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
