import { StyleSheet } from "@react-pdf/renderer";

const ACCENT = "#1a56db";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#4b5563";
const TEXT_MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG_LIGHT = "#f9fafb";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEXT_PRIMARY,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 44,
    lineHeight: 1.4,
  },

  // Header
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 11,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  headline: {
    fontSize: 9,
    color: TEXT_SECONDARY,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 6,
  },
  contactItem: {
    fontSize: 8,
    color: TEXT_SECONDARY,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  contactLabel: {
    color: TEXT_MUTED,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  tag: {
    fontSize: 7,
    color: ACCENT,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },

  // Key metrics
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    backgroundColor: BG_LIGHT,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  metricBox: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    marginBottom: 1,
  },
  metricLabel: {
    fontSize: 7,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },
  metricDetail: {
    fontSize: 6.5,
    color: TEXT_MUTED,
    textAlign: "center",
  },

  // Section
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  // Experience / Projects
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    flex: 1,
  },
  entryMeta: {
    fontSize: 8,
    color: TEXT_MUTED,
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
  entry: {
    marginBottom: 10,
  },

  // Bullets
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 2,
  },
  bullet: {
    fontSize: 8.5,
    color: ACCENT,
    marginRight: 4,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 1.45,
  },

  // Skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  skillCategory: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
    width: 100,
    flexShrink: 0,
  },
  skillList: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    flex: 1,
    lineHeight: 1.4,
  },

  // Tech stack chips
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 3,
  },
  techChip: {
    fontSize: 7,
    color: TEXT_SECONDARY,
    backgroundColor: BG_LIGHT,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: BORDER,
  },

  // Education / Awards
  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  boldText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: TEXT_PRIMARY,
  },
  mutedText: {
    fontSize: 8,
    color: TEXT_MUTED,
  },
  subText: {
    fontSize: 8.5,
    color: TEXT_SECONDARY,
    marginTop: 1,
  },
});
