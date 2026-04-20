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
        <View key={i} style={[styles.entry, { marginBottom: 5 }]}>
          <View style={styles.twoCol}>
            <Text style={styles.boldText}>{a.title}</Text>
            <Text style={styles.mutedText}>
              {a.organization}
              {a.year ? ` · ${a.year}` : ""}
            </Text>
          </View>
          <Text style={styles.subText}>{a.description}</Text>
        </View>
      ))}
    </View>
  );
}
