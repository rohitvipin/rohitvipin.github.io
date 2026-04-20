import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Award } from "../../../src/types";

export function Awards({ awards }: { awards: Award[] }) {
  if (!awards.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Awards</Text>
      {awards.map((a, i) => (
        <View key={i} style={styles.entry} wrap={false}>
          <View style={styles.twoColRow}>
            <Text style={styles.twoColLeft}>{a.title}</Text>
            <Text style={styles.twoColRight}>{a.year ?? ""}</Text>
          </View>
          <Text style={styles.subText}>{a.organization}</Text>
          <Text style={styles.bodyText}>{a.description}</Text>
        </View>
      ))}
    </View>
  );
}
