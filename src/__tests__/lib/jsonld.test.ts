import { describe, it, expect } from "vitest";
import { buildPersonJsonLd } from "@/lib/jsonld";
import type { Social, Profile, ExperienceEntry, Education } from "@/types";

const BASE_URL = "https://example.com";
const AVATAR = "/avatar.jpg";
const KNOWS_ABOUT = ["AWS", "Engineering Leadership", "Platform Modernisation"];

const httpSocial: Social = {
  platform: "GitHub",
  url: "https://github.com/rohitvipin",
  icon: "FaGithub",
};
const nonHttpSocial: Social = {
  platform: "Email",
  url: "mailto:rohitvipin@gmail.com",
  icon: "FaEnvelope",
};

const mockProfile: Profile = {
  name: "Test User",
  title: "Engineering Director",
  headline: "Test headline",
  location: "Kerala, India",
  bio: "Test bio",
  email: "test@example.com",
  years_of_experience: 15,
  timezone: "IST",
  availability_status: "open",
  github_avatar: "https://avatars.githubusercontent.com/u/12345",
  country_code: "IN",
  key_metrics: [{ label: "Years", value: "15+", detail: "years exp", tier: "primary" }],
};

const defaults = {
  baseUrl: BASE_URL,
  avatarHref: AVATAR,
  socials: [] as Social[],
  knowsAbout: [] as string[],
  profile: mockProfile,
  experience: [] as ExperienceEntry[],
  education: [] as Education[],
};

describe("buildPersonJsonLd", () => {
  it("sets url to baseUrl", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.url).toBe(BASE_URL);
  });

  it("constructs image by concatenating baseUrl and avatarHref", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.image).toBe(`${BASE_URL}${AVATAR}`);
  });

  it("includes only http socials in sameAs", () => {
    const ld = buildPersonJsonLd({
      ...defaults,
      socials: [httpSocial, nonHttpSocial],
    });
    expect(ld.sameAs).toEqual([httpSocial.url]);
  });

  it("returns empty sameAs when no http socials", () => {
    const ld = buildPersonJsonLd({ ...defaults, socials: [nonHttpSocial] });
    expect(ld.sameAs).toEqual([]);
  });

  it("returns empty sameAs when socials array is empty", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.sameAs).toEqual([]);
  });

  it("has schema.org context and Person type", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
  });

  it("sets correct address country and locality", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.address.addressCountry).toBe("IN");
    expect(ld.address.addressLocality).toBe("Kerala");
  });

  it("sets occupation location to India", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.hasOccupation.occupationLocation.name).toBe("India");
  });

  it("maps multiple http socials to sameAs", () => {
    const second: Social = {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/rohitvipin",
      icon: "FaLinkedin",
    };
    const ld = buildPersonJsonLd({
      ...defaults,
      socials: [httpSocial, second],
    });
    expect(ld.sameAs).toEqual([httpSocial.url, second.url]);
  });

  it("passes knowsAbout through from params", () => {
    const ld = buildPersonJsonLd({ ...defaults, knowsAbout: KNOWS_ABOUT });
    expect(ld.knowsAbout).toEqual(KNOWS_ABOUT);
    expect(ld.knowsAbout).toContain("AWS");
    expect(ld.knowsAbout).toContain("Engineering Leadership");
    expect(ld.knowsAbout).toContain("Platform Modernisation");
  });

  it("returns empty knowsAbout when passed empty array", () => {
    const ld = buildPersonJsonLd(defaults);
    expect(ld.knowsAbout).toEqual([]);
  });

  it("omits worksFor when experience array is empty", () => {
    const ld = buildPersonJsonLd({ ...defaults, experience: [] });
    expect("worksFor" in ld).toBe(false);
  });

  it("worksFor uses the current:true entry, not experience[0]", () => {
    const pastEmployer: ExperienceEntry = {
      company: "Old Corp",
      role: "Engineer",
      location: "Remote",
      duration: "January 2018 - December 2020",
      current: false,
      description: "desc",
      techStack: [],
      highlights: [],
    };
    const currentEmployer: ExperienceEntry = {
      company: "New Corp",
      role: "Director",
      location: "Remote",
      duration: "January 2021 - Present",
      current: true,
      description: "desc",
      techStack: [],
      highlights: [],
    };
    const ld = buildPersonJsonLd({
      ...defaults,
      experience: [pastEmployer, currentEmployer],
    });
    expect(ld.worksFor?.name).toBe("New Corp");
  });

  it("worksFor is absent when no current:true entry exists", () => {
    const exp: ExperienceEntry = {
      company: "Solo Corp",
      role: "Engineer",
      location: "Remote",
      duration: "2021",
      current: false,
      description: "desc",
      techStack: [],
      highlights: [],
    };
    const ld = buildPersonJsonLd({ ...defaults, experience: [exp] });
    expect(ld.worksFor).toBeUndefined();
  });

  it("location without comma uses locality as lastPart", () => {
    const ld = buildPersonJsonLd({
      ...defaults,
      profile: { ...mockProfile, location: "India" },
    });
    expect(ld.address.addressLocality).toBe("India");
    expect(ld.hasOccupation.occupationLocation.name).toBe("India");
  });

  it("addressCountry falls back to lastPart when country_code absent", () => {
    const ld = buildPersonJsonLd({
      ...defaults,
      profile: { ...mockProfile, country_code: undefined, location: "Kerala, India" },
    });
    expect(ld.address.addressCountry).toBe("India");
  });

  it("additionalName is undefined for single-word name", () => {
    const ld = buildPersonJsonLd({
      ...defaults,
      profile: { ...mockProfile, name: "Cher" },
    });
    expect(ld.additionalName).toBeUndefined();
  });

  it("alumniOf is set when education array is non-empty", () => {
    const edu: Education = {
      degree: "B.Tech",
      institution: "Test University",
      location: "Remote",
      year: "2009",
    };
    const ld = buildPersonJsonLd({ ...defaults, education: [edu] });
    expect(ld.alumniOf?.name).toBe("Test University");
  });

  it("alumniOf is absent when education array is empty", () => {
    const ld = buildPersonJsonLd({ ...defaults, education: [] });
    expect("alumniOf" in ld).toBe(false);
  });

  it("sets hasOccupation.skills from knowsAbout param", () => {
    const ld = buildPersonJsonLd({ ...defaults, knowsAbout: KNOWS_ABOUT });
    expect((ld.hasOccupation as Record<string, unknown>).skills).toBe(KNOWS_ABOUT.join(", "));
  });

  it("omits hasOccupation.skills when knowsAbout is empty", () => {
    const ld = buildPersonJsonLd(defaults);
    expect("skills" in ld.hasOccupation).toBe(false);
  });
});
