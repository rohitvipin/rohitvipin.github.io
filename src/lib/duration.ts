export function parseStartYear(duration: string): number {
  const match = duration.match(/\b(19|20)\d{2}\b/);
  if (!match) {
    console.warn(`parseStartYear: no year found in "${duration}"`);
  }
  return Number(match?.[0] ?? 0);
}

export function byStartYearDesc<T extends { duration: string }>(a: T, b: T): number {
  return parseStartYear(b.duration) - parseStartYear(a.duration);
}
