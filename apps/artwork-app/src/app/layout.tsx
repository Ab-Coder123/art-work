import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Plus_Jakarta_Sans, Permanent_Marker, Cairo } from "next/font/google";
import { LOCALE_COOKIE_NAME, isValidLocale, type Locale } from "@art-work/types";
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

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://artwork-marketing.vercel.app"),
  title: "Artwork Marketing Solution",
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
    title: "Artwork Marketing Solution",
    description:
      "Interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    url: "https://artwork-solutions.stage",
    siteName: "Artwork Marketing Solution",
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
    title: "Artwork Marketing Solution",
    description:
      "Interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    images: ["/assets/images/artwork_logo.png"],
  },
};

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { FloatingContactWidget } from "@/components/home/FloatingContactWidget";

async function resolveRootLocale(): Promise<Locale> {
  try {
    const headerStore = await headers();
    const hLocale = headerStore.get("x-artwork-locale");
    if (isValidLocale(hLocale)) return hLocale;
    const cookieStore = await cookies();
    const cLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
    if (isValidLocale(cLocale)) return cLocale;
  } catch {
    // Fallback cleanly during static pre-rendering
  }
  return "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await resolveRootLocale();
  const initialDir = initialLocale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={initialLocale}
      dir={initialDir}
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${permanentMarker.variable} ${cairo.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("artwork_theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&d)||(t==="system"&&d)){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark");document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-theme","light");document.documentElement.style.colorScheme="light";}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#0C0C10] text-black dark:text-[#F3F3F5] font-body selection:bg-yellow-400 selection:text-black antialiased overflow-x-hidden relative transition-colors duration-200">
        <ThemeProvider>
          {children}
          <FloatingContactWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
