import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { CommunityEntry } from "../../../src/types";

interface CommunityProps {
  entries: CommunityEntry[];
  maxItems?: number;
}

export function Community({ entries, maxItems }: CommunityProps) {
  const list = maxItems ? entries.slice(0, maxItems) : entries;
  if (!list.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Community</Text>
      {list.map((e, i) => (
        <View key={i} style={styles.entry}>
          <View style={styles.twoColRow}>
            <Text style={styles.entryTitle}>{e.title}</Text>
            <Text style={styles.twoColRight}>{e.type}</Text>
          </View>
          {e.location && <Text style={styles.entrySubtitle}>{e.location}</Text>}
          <Text style={styles.entryDescription}>{e.description}</Text>
          {e.highlights.map((h, j) => (
            <View key={j} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>-</Text>
              <Text style={styles.bulletText}>{h}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
