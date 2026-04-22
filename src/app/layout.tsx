import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { profile, socials } from "@/lib/data";
import { escapeJsonLd } from "@/lib/escape";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-code",
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
    "Engineering leader with 15 years building cloud-native platforms and scaling engineering organisations. Led 350+ engineers across USA and India. AI enablement, platform modernisation, and delivery execution. Open to VP Engineering, CTO, and Director roles.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rohit Vipin Mathews",
  givenName: "Rohit",
  additionalName: "Vipin",
  familyName: "Mathews",
  jobTitle: "Director - Engineering & Architecture",
  description:
    "Engineering leader with 15 years building cloud-native platforms and scaling engineering organisations. Open to VP Engineering, CTO, and Director roles.",
  url: BASE_URL,
  email: profile.email,
  image: profile.github_avatar,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kerala",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: "CES IT",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Sree Narayana Gurukulam College of Engineering",
  },
  sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
  knowsAbout: [
    "Engineering Leadership",
    "Platform Engineering",
    "Cloud Architecture",
    "AWS",
    "Azure",
    ".NET",
    "Microservices",
    "AI Engineering",
    "AWS Bedrock",
    "RAG Systems",
    "Distributed Systems",
    "Kubernetes",
    "Serverless Architecture",
    "Platform Modernisation",
    "Engineering Organisations",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Director - Engineering & Architecture",
    occupationLocation: {
      "@type": "Country",
      name: "India",
    },
    skills:
      "Cloud Architecture, AWS, .NET, AI Engineering, Engineering Leadership, Platform Modernisation, VP Engineering, CTO",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(jsonLd)) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
