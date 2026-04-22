import type { Social } from "@/types";

export interface PersonJsonLdParams {
  baseUrl: string;
  avatarHref: string;
  socials: Social[];
}

export function buildPersonJsonLd({ baseUrl, avatarHref, socials }: PersonJsonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohit Vipin Mathews",
    givenName: "Rohit",
    additionalName: "Vipin",
    familyName: "Mathews",
    jobTitle: "Director - Engineering & Architecture",
    description:
      "Engineering leader with 15 years building cloud-native platforms and scaling engineering organisations. Open to VP Engineering, CTO, and Director roles.",
    url: baseUrl,
    image: `${baseUrl}${avatarHref}`,
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
}
