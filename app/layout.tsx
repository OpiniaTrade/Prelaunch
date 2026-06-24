import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
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
  title: "Opinia — Turn Predictions Into Real-World Rewards",
  description:
    "Predict the future of your favorite creators. Earn exclusive rewards, VIP show tickets and access exclusive content by showing your fandom.",
  keywords: [
    "Opinia",
    "predictions",
    "creator economy",
    "prediction market",
    "creators",
    "rewards",
    "VIP tickets",
    "exclusive content",
    "fandom",
    "web3",
    "Ramanshu Sharan Mishra",
    "Ramanshu",
  ],
  authors: [
    { name: "Ramanshu Sharan Mishra", url: "https://www.ramspace.fun" },
  ],
  creator: "Opinia",
  metadataBase: new URL("https://opinia.slugfeast.fun"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Opinia — Turn Predictions Into Real-World Rewards",
    description:
      "Predict the future of your favorite creators. Earn exclusive rewards, VIP show tickets and access exclusive content by showing your fandom.",
    url: "https://opinia.slugfeast.fun",
    siteName: "Opinia",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://opinia.slugfeast.fun/og.png",
        width: 1200,
        height: 630,
        alt: "Opinia — Predict the future of your favorite creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Opinia — Turn Predictions Into Real-World Rewards",
    description:
      "Predict the future of your favorite creators. Earn exclusive rewards, VIP show tickets and access exclusive content by showing your fandom.",
    site: "@RamanshuSharan",
    creator: "@RamanshuSharan",
    images: ["https://opinia.slugfeast.fun/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Analytics>
      </Analytics>
      <body className="min-h-full flex flex-col">{children}</body>     
    </html>
  );
}
