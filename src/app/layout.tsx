import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { TopLoadingBar } from "@/components/top-loading-bar";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpiritualWoman Fellowship",
  description: "A welcoming Christian fellowship community and blog platform.",
  icons: {
    icon: [
      { url: "/images/logo.jpeg?v=3", type: "image/jpeg" },
    ],
    shortcut: [{ url: "/images/logo.jpeg?v=3" }],
    apple: [{ url: "/images/logo.jpeg?v=3" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
