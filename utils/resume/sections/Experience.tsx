import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { ExperienceEntry } from "../../../src/types";

function parseStartYear(duration: string): number {
  const token = duration.split(" - ")[0].trim();
  const parts = token.split(" ");
  return parseInt(parts[parts.length - 1], 10) || 0;
}

interface ExperienceProps {
  entries: ExperienceEntry[];
  sinceYear?: number;
}

export function Experience({ entries, sinceYear }: ExperienceProps) {
  const filtered = sinceYear
    ? entries.filter((e) => parseStartYear(e.duration) >= sinceYear)
    : entries;

  if (!filtered.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {filtered.map((entry, i) => (
        <View key={i} style={styles.entry} wrap={false}>
          <View style={styles.entryTitleRow}>
            <Text style={styles.entryTitle}>{entry.role}</Text>
            <Text style={styles.entryDuration}>{entry.duration}</Text>
          </View>
          <Text style={styles.entrySubtitle}>
            {entry.company} - {entry.location}
          </Text>
          <Text style={styles.entryDescription}>{entry.description}</Text>
          {entry.highlights.map((h, j) => (
            <View key={j} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>-</Text>
              <Text style={styles.bulletText}>{h}</Text>
            </View>
          ))}
          {entry.techStack.length > 0 && (
            <Text style={styles.techLine}>Tech: {entry.techStack.join(", ")}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
