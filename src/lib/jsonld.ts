import type { Social, Profile, ExperienceEntry, Education } from "../types";

export interface PersonJsonLdParams {
  baseUrl: string;
  avatarHref: string;
  socials: Social[];
  knowsAbout: string[];
  profile: Profile;
  experience: ExperienceEntry[];
  education: Education[];
}

export function buildPersonJsonLd({
  baseUrl,
  avatarHref,
  socials,
  knowsAbout,
  profile,
  experience,
  education,
}: PersonJsonLdParams) {
  const [locality, ...rest] = profile.location.split(",").map((s) => s.trim());
  const lastPart = rest.length > 0 ? rest[rest.length - 1] : locality;
  const addressCountry = profile.country_code ?? lastPart;
  const currentEmployer = experience.find((e) => e.current) ?? experience[0];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: profile.name.split(" ")[0],
    additionalName: profile.name.split(" ")[1] ?? undefined,
    familyName: profile.name.split(" ").slice(-1)[0],
    jobTitle: profile.title,
    description: profile.headline,
    url: baseUrl,
    image: `${baseUrl}${avatarHref}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressCountry,
    },
    ...(currentEmployer
      ? {
          worksFor: {
            "@type": "Organization",
            name: currentEmployer.company,
          },
        }
      : {}),
    ...(education[0]
      ? {
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: education[0].institution,
          },
        }
      : {}),
    sameAs: socials.filter((s) => s.url.startsWith("http")).map((s) => s.url),
    knowsAbout,
    hasOccupation: {
      "@type": "Occupation",
      name: profile.title,
      occupationLocation: {
        "@type": "Country",
        name: lastPart,
      },
      skills: profile.knows_about?.join(", ") ?? "",
    },
  };
}
