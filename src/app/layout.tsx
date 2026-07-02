import type { Metadata } from "next";
import { Roboto, Playfair_Display, Allura } from "next/font/google";
import { Suspense } from "react";
import { TopLoadingBar } from "@/components/top-loading-bar";
import "./globals.css";

const robotoFont = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const playfairFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const alluraFont = Allura({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="en" className={`${robotoFont.variable} ${playfairFont.variable} ${alluraFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}