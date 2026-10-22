import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Analytics } from "@/components/providers/Analytics";
import { regions, type Region } from "@/lib/region";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "@/app/globals.css";

const display = Funnel_Display({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-funnel-display",
  display: "swap",
});

const sans = Funnel_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-funnel-sans",
  display: "swap",
});

/** Shared <html> shell for each regional edition's root layout. */
export function rootMetadata(region: Region): Metadata {
  const { titleSuffix, ogLocale } = regions[region];
  const name = `${SITE_NAME}${titleSuffix}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s | ${name}` },
    applicationName: SITE_NAME,
    openGraph: { type: "website", locale: ogLocale, siteName: name },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/images/psquare-mark.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export function RootDocument({ region, children }: { region: Region; children: ReactNode }) {
  return (
    <html
      lang={regions[region].lang}
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
