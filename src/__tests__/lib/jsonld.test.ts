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
});
