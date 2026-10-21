import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Analytics } from "@/components/providers/Analytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} Canada`,
    template: `%s | ${SITE_NAME} Canada`,
  },
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: `${SITE_NAME} Canada`,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/psquare-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#fafaf8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
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
