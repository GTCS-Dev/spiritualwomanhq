import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { TopLoadingBar } from "@/components/top-loading-bar";
import "./globals.css";

const appFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SpiritualWoman Fellowship",
  description: "A welcoming Christian fellowship community and blog platform.",
  icons: {
    icon: "/images/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${appFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
