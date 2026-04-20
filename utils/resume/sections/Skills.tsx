import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import type { SkillCategory } from "../../../src/types";

export function Skills({ categories }: { categories: SkillCategory[] }) {
  if (!categories.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Skills</Text>
      {categories.map((cat) => (
        <View key={cat.category} style={styles.skillRow}>
          <Text style={styles.skillLabel}>{cat.category}</Text>
          <Text style={styles.skillValue}>{cat.skills.join(", ")}</Text>
        </View>
      ))}
    </View>
  );
}
