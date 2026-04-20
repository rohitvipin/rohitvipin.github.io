import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { Leadership as LeadershipData } from "../../../src/types";

export function Leadership({ data }: { data: LeadershipData }) {
  if (!data.sections.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{data.title}</Text>
      {data.sections.map((s, i) => (
        <View key={i} style={styles.entry}>
          <Text style={styles.boldText}>{s.title}</Text>
          <Text style={styles.subText}>{s.description}</Text>
        </View>
      ))}
    </View>
  );
}
