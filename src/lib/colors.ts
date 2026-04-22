const COMPANY_COLORS: Record<string, string> = {
  "CES IT": "#6366f1",
  "Vofox Solutions": "#22d3ee",
  "Essel Swolutions": "#f59e0b",
};

const DOMAIN_PREFIXES: [string, string][] = [
  ["K-12", "#6366f1"],
  ["Agriculture", "#22c55e"],
  ["Logistics", "#f59e0b"],
  ["Hospitality", "#ec4899"],
  ["Open Source / Mobile", "#22d3ee"],
  ["Open Source / Developer Tooling", "#8b5cf6"],
  ["Open Source / Cloud", "#f97316"],
  ["Open Source", "#22d3ee"],
];

const FALLBACK = "#6366f1";

export function getCompanyColor(company: string): string {
  return COMPANY_COLORS[company] ?? FALLBACK;
}

export function getDomainColor(domain: string): string {
  for (const [prefix, color] of DOMAIN_PREFIXES) {
    if (domain.startsWith(prefix)) return color;
  }
  return FALLBACK;
}
