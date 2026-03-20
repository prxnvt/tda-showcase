import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/layout/Providers";
import TabNav from "@/components/layout/TabNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDA Showcase — Topological Data Analysis",
  description:
    "Interactive demonstrations of persistent homology applied to finance, ECG, and synthetic signals. From-scratch TDA pipeline with microservice architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TabNav />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
