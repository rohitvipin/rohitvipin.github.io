import { StyleSheet } from "@react-pdf/renderer";

const ACCENT = "#1a56db";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#4b5563";
const TEXT_MUTED = "#6b7280";
const BORDER = "#d1d5db";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEXT_PRIMARY,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },

  // ── Header ──────────────────────────────────────
  header: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginBottom: 5,
    lineHeight: 1.4,
  },
  contactLine: {
    fontSize: 8,
    color: TEXT_MUTED,
    marginBottom: 3,
  },
  linkText: {
    fontSize: 8,
    color: ACCENT,
  },

  // ── Key metrics (single pipe-separated text line) ──
  metricsLine: {
    fontSize: 7.5,
    color: TEXT_MUTED,
    marginTop: 4,
  },

  // ── Section ─────────────────────────────────────
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  // ── Entry (experience / projects / community) ──
  entry: {
    marginBottom: 7,
  },
  entryTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    flex: 1,
  },
  entryTitleBlock: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  entryDuration: {
    fontSize: 8,
    color: TEXT_MUTED,
    width: 90,
    flexShrink: 0,
    textAlign: "right",
  },
  entrySubtitle: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginBottom: 3,
  },
  entryDescription: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginBottom: 4,
    lineHeight: 1.5,
  },

  // ── Bullets ─────────────────────────────────────
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  bulletMark: {
    fontSize: 8.5,
    color: TEXT_MUTED,
    width: 10,
    flexShrink: 0,
    paddingTop: 1,
  },
  bulletText: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 1.5,
  },

  // ── Tech / Stack (plain text label + value) ──────
  techLine: {
    fontSize: 7.5,
    color: TEXT_MUTED,
    marginTop: 3,
  },

  // ── Skills (label: value rows) ───────────────────
  skillRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  skillLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    width: 110,
    flexShrink: 0,
  },
  skillValue: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 1.5,
  },

  // ── Education / Awards (label + right-aligned year) ──
  twoColRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  twoColLeft: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    flex: 1,
  },
  twoColRight: {
    fontSize: 8,
    color: TEXT_MUTED,
    width: 60,
    textAlign: "right",
    flexShrink: 0,
  },
  subText: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginBottom: 3,
  },
  bodyText: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    lineHeight: 1.5,
    marginBottom: 3,
  },
});
