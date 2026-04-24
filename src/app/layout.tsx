import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { socials, profile, experience, education } from "@/lib/data";
import { escapeForJsonLdScript } from "@/lib/escape";
import { buildPersonJsonLd } from "@/lib/jsonld";
import { avatarHref, avatarWebpHref } from "@/lib/paths";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rohitvipin.github.io";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Rohit Vipin Mathews | Director - Engineering & Architecture",
  description:
    "Engineering Director with 15 years building cloud-native platforms. Led 350+ engineers. Architecture, AI enablement, modernisation. Open to VP / CTO roles.",
  keywords: [
    "Rohit Vipin Mathews",
    "VP Engineering",
    "CTO",
    "Director of Engineering",
    "Engineering Director",
    "Platform Engineering",
    "Cloud Architect",
    "AWS",
    ".NET",
    "AI Engineering",
    "Engineering Leadership",
    "Kerala India",
    "CES IT",
    "K-12 HCM",
    "AWS Bedrock",
    "RAG",
    "Microservices",
    "Platform Modernisation",
  ],
  authors: [{ name: "Rohit Vipin Mathews", url: BASE_URL }],
  creator: "Rohit Vipin Mathews",
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Rohit Vipin Mathews | Director - Engineering & Architecture",
    description:
      "Engineering leader with 15 years building cloud-native platforms. Led 350+ engineers across USA and India. Open to VP Engineering, CTO, and Director roles.",
    siteName: "Rohit Vipin Mathews",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohit Vipin Mathews | Director - Engineering & Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Vipin Mathews | Director - Engineering & Architecture",
    description:
      "Engineering leader with 15 years scaling 350+ engineers. Cloud-native platforms, AI enablement, and platform modernisation. Open to VP Engineering and CTO-track roles.",
    images: ["/og-image.jpg"],
    creator: "@rohitvipin",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

const jsonLd = buildPersonJsonLd({
  baseUrl: BASE_URL,
  avatarHref,
  socials,
  knowsAbout: profile.knows_about ?? [],
  profile,
  experience,
  education,
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* script-src 'unsafe-inline': Next.js static export injects inline bootstrap scripts; nonces are not viable without a server runtime */}
        {/* style-src 'unsafe-inline': next-themes applies inline styles on <html> for FOUC prevention during SSR/hydration; cannot be replaced with a class-only approach without forking the library */}
        {/* 'unsafe-eval' added in dev only: React requires eval() for call-stack reconstruction in development mode */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'`}
        />
        {/* X-Content-Type-Options and Permissions-Policy must be HTTP response headers — meta tags are ignored by browsers for these directives. GitHub Pages does not support custom headers. */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        {process.env.NEXT_PUBLIC_BUILD_SHA ? (
          <meta name="build-sha" content={process.env.NEXT_PUBLIC_BUILD_SHA} />
        ) : null}
        <link
          rel="preload"
          as="image"
          href={avatarWebpHref}
          type="image/webp"
          fetchPriority="high"
          media="(min-width: 1024px)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeForJsonLdScript(JSON.stringify(jsonLd)) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--bg)] focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
