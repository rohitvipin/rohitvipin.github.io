export function parseStartYear(duration: string): number {
  const match = duration.match(/\d{4}/);
  if (!match && process.env.NODE_ENV !== "production") {
    console.warn(`parseStartYear: no year found in "${duration}"`);
  }
  return Number(match?.[0] ?? 0);
}

export function byStartYearDesc<T extends { duration: string }>(a: T, b: T): number {
  return parseStartYear(b.duration) - parseStartYear(a.duration);
}
