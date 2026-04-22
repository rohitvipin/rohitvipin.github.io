import { describe, it, expect } from "vitest";
import { buildPersonJsonLd } from "@/lib/jsonld";
import type { Social } from "@/types";

const BASE_URL = "https://example.com";
const AVATAR = "/avatar.jpg";

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

describe("buildPersonJsonLd", () => {
  it("sets url to baseUrl", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.url).toBe(BASE_URL);
  });

  it("constructs image by concatenating baseUrl and avatarHref", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.image).toBe(`${BASE_URL}${AVATAR}`);
  });

  it("includes only http socials in sameAs", () => {
    const ld = buildPersonJsonLd({
      baseUrl: BASE_URL,
      avatarHref: AVATAR,
      socials: [httpSocial, nonHttpSocial],
    });
    expect(ld.sameAs).toEqual([httpSocial.url]);
  });

  it("returns empty sameAs when no http socials", () => {
    const ld = buildPersonJsonLd({
      baseUrl: BASE_URL,
      avatarHref: AVATAR,
      socials: [nonHttpSocial],
    });
    expect(ld.sameAs).toEqual([]);
  });

  it("returns empty sameAs when socials array is empty", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.sameAs).toEqual([]);
  });

  it("has schema.org context and Person type", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
  });

  it("sets correct address country and locality", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.address.addressCountry).toBe("IN");
    expect(ld.address.addressLocality).toBe("Kerala");
  });

  it("sets occupation location to India", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.hasOccupation.occupationLocation.name).toBe("India");
  });

  it("maps multiple http socials to sameAs", () => {
    const second: Social = {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/rohitvipin",
      icon: "FaLinkedin",
    };
    const ld = buildPersonJsonLd({
      baseUrl: BASE_URL,
      avatarHref: AVATAR,
      socials: [httpSocial, second],
    });
    expect(ld.sameAs).toEqual([httpSocial.url, second.url]);
  });

  it("includes expected knowsAbout entries", () => {
    const ld = buildPersonJsonLd({ baseUrl: BASE_URL, avatarHref: AVATAR, socials: [] });
    expect(ld.knowsAbout).toContain("AWS");
    expect(ld.knowsAbout).toContain("Engineering Leadership");
    expect(ld.knowsAbout).toContain("Platform Modernisation");
  });
});
