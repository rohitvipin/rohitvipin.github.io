import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { profile } from "@/lib/data";
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

const BASE_URL = "https://rohitvipin.github.io/rohit-profile";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Rohit Vipin Mathews — Director of Engineering & Architecture",
  description:
    "Director of Engineering & Architecture with 14+ years scaling 350+ engineers across USA and India. Cloud-native, AI-enabled platforms across K-12 Education, Agriculture, Logistics, and Hospitality.",
  keywords: [
    "Rohit Vipin Mathews",
    "Director of Engineering",
    "Cloud Architect",
    "AWS",
    ".NET",
    "AI Engineering",
    "Kerala India",
    "CES",
    "K-12 HCM",
    "AWS Bedrock",
    "RAG",
    "Microservices",
  ],
  authors: [{ name: "Rohit Vipin Mathews", url: BASE_URL }],
  creator: "Rohit Vipin Mathews",
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Rohit Vipin Mathews — Director of Engineering & Architecture",
    description:
      "Engineering leader scaling 350+ engineers across USA & India. Cloud-native, AI-enabled platforms across K-12 Education, Agriculture, Logistics, and Hospitality.",
    siteName: "Rohit Vipin Mathews",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rohit Vipin Mathews — Director of Engineering & Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohit Vipin Mathews — Director of Engineering & Architecture",
    description:
      "Engineering leader scaling 350+ engineers. Cloud-native, AI-enabled platforms across Education, Agriculture, Logistics, and Hospitality.",
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
  jobTitle: "Director - Engineering & Architecture",
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
    name: "CES",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Sree Narayana Gurukulam College of Engineering",
  },
  sameAs: [
    "https://github.com/rohitvipin",
    "https://www.linkedin.com/in/rohitvipinmathews",
    "https://stackoverflow.com/users/1202166/rohit-vipin-mathews",
    "https://twitter.com/rohitvipin",
  ],
  knowsAbout: [
    "Cloud Architecture",
    "AWS",
    "Azure",
    ".NET",
    "Microservices",
    "AI Engineering",
    "AWS Bedrock",
    "RAG Systems",
    "Engineering Leadership",
    "Distributed Systems",
    "Kubernetes",
    "Serverless Architecture",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Director of Engineering & Architecture",
    occupationLocation: {
      "@type": "Country",
      name: "India",
    },
    skills: "Cloud Architecture, AWS, .NET, AI Engineering, Team Leadership",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
