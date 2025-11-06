import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: {
    default: "PURGA* - Handmade Knitted Items",
    template: "%s | PURGA*",
  },
  description: "Discover beautiful handmade knitted items from PURGA*. Unique, quality pieces crafted with care.",
  keywords: ["knitted items", "handmade", "yarn", "Czech Republic", "e-commerce"],
  authors: [{ name: "PURGA*" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://purga.knit",
    siteName: "PURGA*",
    title: "PURGA* - Handmade Knitted Items",
    description: "Discover beautiful handmade knitted items from PURGA*",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
