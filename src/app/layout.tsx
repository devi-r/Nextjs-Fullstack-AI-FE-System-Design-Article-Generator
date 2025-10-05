import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Devi's AI FE System Designer",
  description: "Devi's AI FE System Designer",
  icons: {
    icon: "/icon.png", // /public path
    apple: "/icon.png", // /public path
    shortcut: "/icon.png", // /public path
  },
  openGraph: {
    title: "Devi's AI FE System Designer",
    description: "Devi's AI FE System Designer",
    images: [
      {
        url: "https://nextjs-fullstack-ai-fe-system-desig.vercel.app/icon.png", // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: "A preview of AI FE System Designer",
      },
    ],
    locale: "en_US",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
