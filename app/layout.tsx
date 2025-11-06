import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "purga.knit - Handmade Knitted Items",
    template: "%s | purga.knit",
  },
  description: "Discover beautiful handmade knitted items from purga.knit. Unique, quality pieces crafted with care.",
  keywords: ["knitted items", "handmade", "yarn", "Czech Republic", "e-commerce"],
  authors: [{ name: "purga.knit" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://purga.knit",
    siteName: "purga.knit",
    title: "purga.knit - Handmade Knitted Items",
    description: "Discover beautiful handmade knitted items from purga.knit",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
