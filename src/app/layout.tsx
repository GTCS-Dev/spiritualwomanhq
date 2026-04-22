import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${appFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TopLoadingBar />
        {children}
      </body>
    </html>
  );
}
