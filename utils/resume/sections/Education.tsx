import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Education as EducationData } from "../../../src/types";

export function Education({ entries }: { entries: EducationData[] }) {
  if (!entries.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {entries.map((e, i) => (
        <View key={i} style={[styles.entry, { marginBottom: 4 }]}>
          <View style={styles.twoCol}>
            <Text style={styles.boldText}>{e.degree}</Text>
            <Text style={styles.mutedText}>{e.year}</Text>
          </View>
          <Text style={styles.subText}>
            {e.institution} · {e.location}
          </Text>
        </View>
      ))}
    </View>
  );
}
