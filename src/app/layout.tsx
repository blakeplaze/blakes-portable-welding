import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Mobile Welding in Detroit, MI | Blake's Portable Welding",
  description:
    "Licensed and insured mobile welding in Metro Detroit since 2012. Aluminum, steel, stainless, and on-site repairs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-white font-sans text-foreground" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
