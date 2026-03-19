import type { Metadata } from "next";
import { Pacifico, Comic_Neue, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const headingScript = Pacifico({
  variable: "--font-heading-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const bodySans = Comic_Neue({
  variable: "--font-body-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Katie Beth",
  description:
    "Recommendations by climate, skin tone, durability, and comfort. Find fabrics that flatter and perform.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingScript.variable} ${bodySans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
