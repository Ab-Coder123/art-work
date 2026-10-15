import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Permanent_Marker } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://artwork-marketing.vercel.app"),
  title: "ART WORK — Creative Marketing Solutions | Kinetic Stage Edition",
  description:
    "We are Art Work: an interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
  keywords: [
    "Art Work",
    "Marketing Solutions",
    "Arena Scenography",
    "Kinetic Typography",
    "3D Stage Design",
    "Experiential Marketing",
    "Creative Studio",
  ],
  authors: [{ name: "Art Work Collective" }],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "ART WORK — Creative Marketing Solutions",
    description:
      "Interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    url: "https://artwork-solutions.stage",
    siteName: "Art Work Marketing Solutions",
    images: [
      {
        url: "/assets/images/artwork_logo.png",
        width: 281,
        height: 295,
        alt: "Art Work Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ART WORK — Creative Marketing Solutions",
    description:
      "Interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    images: ["/assets/images/artwork_logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${permanentMarker.variable} scroll-smooth`}
    >
      <body className="bg-white text-black font-body selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden relative">
        {children}
      </body>
    </html>
  );
}
