export function parseStartYear(duration: string): number {
  return Number(duration.match(/\d{4}/)?.[0] ?? 0);
}

export function byStartYearDesc<T extends { duration: string }>(a: T, b: T): number {
  return parseStartYear(b.duration) - parseStartYear(a.duration);
}
